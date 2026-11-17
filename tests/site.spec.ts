import { expect, test } from "@playwright/test";

test("checklist: alerta imediato, resposta alterável, conclusão cautelosa e reinício", async ({
  page,
}) => {
  await page.goto("/");
  const groups = page.locator("#checklist fieldset");
  await expect(groups).toHaveCount(5);
  await groups
    .nth(0)
    .getByLabel("Não sei", { exact: true })
    .check({ force: true });
  await expect(page.locator(".checklist-result")).toContainText(
    "Pare e confirme antes de continuar",
  );
  for (let i = 0; i < 5; i++)
    await groups
      .nth(i)
      .getByLabel(i === 4 ? "Sim" : "Não", { exact: true })
      .check({ force: true });
  await expect(page.locator(".checklist-result")).toContainText(
    "não comprova que a mensagem é segura",
  );
  await expect(page.locator(".checklist-progress")).toContainText("5 de 5");
  await groups.nth(4).getByLabel("Não", { exact: true }).check({ force: true });
  await expect(page.locator(".checklist-result")).toContainText(
    "Pare e confirme antes de continuar",
  );
  await page.getByRole("button", { name: "Reiniciar checklist" }).click();
  await expect(page.locator("input:checked")).toHaveCount(0);
  await expect(page.locator(".checklist-progress")).toContainText("0 de 5");
  await groups.nth(1).getByLabel("Sim", { exact: true }).check({ force: true });
  await page.reload();
  await expect(page.locator("input:checked")).toHaveCount(0);
});

test("teclado: pular conteúdo, foco visível, acordeão e respostas nativas", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const summary = page.locator(".scam summary").first();
  await summary.focus();
  await expect(summary).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.locator(".scam").first()).toHaveAttribute("open", "");
  const radio = page.locator('input[name="question-0"]').first();
  await radio.focus();
  await page.keyboard.press("Space");
  await expect(radio).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[name="question-0"]').nth(1)).toBeChecked();
});

test("controles: tamanho do texto, alto contraste e preferência de movimento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Reduzir movimento" }),
  ).toHaveAttribute("aria-pressed", "true");
  const initial = await page
    .locator("html")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.getByRole("button", { name: "Aumentar tamanho do texto" }).click();
  await expect(page.locator("html")).toHaveCSS(
    "font-size",
    `${initial * 1.1}px`,
  );
  await page.getByRole("button", { name: "Reduzir tamanho do texto" }).click();
  await expect(page.locator("html")).toHaveCSS("font-size", `${initial}px`);
  await page.getByRole("button", { name: "Alto contraste" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "true");
  await expect(page.locator("html")).toHaveCSS(
    "background-color",
    "rgb(17, 17, 17)",
  );
  await page.getByRole("button", { name: "Reduzir movimento" }).click();
  await expect(
    page.getByRole("button", { name: "Reduzir movimento" }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Reduzir movimento" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
});

test("voz: iniciar, interromper, trocar seção e tratar erro sem perder o foco", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = {
      calls: [] as string[],
      canceled: 0,
      utterance: null as SpeechSynthesisUtterance | null,
    };
    Object.defineProperty(window, "__voice", { value: state });
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        cancel: () => {
          state.canceled++;
        },
        getVoices: () => [],
        speak: (utterance: SpeechSynthesisUtterance) => {
          state.calls.push(utterance.text);
          state.utterance = utterance;
        },
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        text: string;
        constructor(text: string) {
          this.text = text;
        }
      },
    });
  });
  await page.goto("/");
  const listen = page.locator("#inicio .listen");
  await listen.focus();
  await page.keyboard.press("Enter");
  await expect(listen).toContainText("Interromper leitura");
  await expect(listen).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => (window as any).__voice.calls[0]))
    .toContain("Proteja-se");
  await listen.click();
  await expect(listen).toContainText("Ouvir este conteúdo");
  await page.locator("#golpes .listen").click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__voice.calls.at(-1)))
    .toContain("Falsos benefícios");
  await page.locator("#protecao .listen").click();
  await expect(page.locator("#golpes .listen")).toContainText(
    "Ouvir este conteúdo",
  );
  await page.evaluate(() =>
    (window as any).__voice.utterance.onerror({
      error: "synthesis-unavailable",
    }),
  );
  await expect(page.locator(".voice-status")).toContainText("Não foi possível");
  await expect(page.locator("#protecao .listen")).toContainText(
    "Ouvir este conteúdo",
  );
});

test("navegador sem voz mantém todo o conteúdo e o checklist utilizáveis", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", { value: undefined });
  });
  await page.goto("/");
  await expect(page.locator("#inicio .listen")).toBeDisabled();
  await expect(page.locator("#inicio .listen")).toContainText("indisponível");
  await page.locator(".scam summary").last().click();
  await expect(page.locator(".scam").last()).toContainText(
    "Não pague nem envie documentos",
  );
});

test("privacidade, navegação e nove assuntos completos", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (req) => {
    if (!req.url().startsWith("http://127.0.0.1:4173"))
      externalRequests.push(req.url());
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".scam")).toHaveCount(9);
  await expect(
    page.locator('input:not([type="radio"]),textarea,form,iframe'),
  ).toHaveCount(0);
  const brokenAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((el) => el.getAttribute("href")!)
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  expect(brokenAnchors).toEqual([]);
  await page
    .locator("#checklist fieldset")
    .first()
    .getByLabel("Sim", { exact: true })
    .check({ force: true });
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookies: "" });
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`layout sem rolagem horizontal em ${width}px, incluindo acordeões abertos e texto ampliado`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() =>
      document
        .querySelectorAll("details")
        .forEach((detail) => (detail.open = true)),
    );
    for (let i = 0; i < 5; i++)
      await page
        .getByRole("button", { name: "Aumentar tamanho do texto" })
        .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Alto contraste" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (width === 390 || width === 1440) {
      for (let i = 0; i < 5; i++)
        await page
          .getByRole("button", { name: "Reduzir tamanho do texto" })
          .click();
      await page.getByRole("button", { name: "Alto contraste" }).click();
      await page.evaluate(() =>
        document
          .querySelectorAll("details")
          .forEach((detail) => (detail.open = false)),
      );
      await page.screenshot({
        path: `test-results/preview-${width}.png`,
        fullPage: true,
      });
    }
  });
}

test("reflow equivalente a 200%: viewport de 640px e ampliação CSS a 200%", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => (document.documentElement.style.zoom = "1"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});
