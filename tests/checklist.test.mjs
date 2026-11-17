import { test } from "node:test";
import assert from "node:assert/strict";
import { questions, getChecklistStatus } from "../src/checklist.mjs";

test("checklist completo: cada combinação preserva o cuidado e sinaliza alertas ou dúvidas", () => {
  assert.equal(getChecklistStatus({}).answered, 0);
  assert.equal(getChecklistStatus({}).alert, false);
  for (
    let combination = 0;
    combination < 3 ** questions.length;
    combination++
  ) {
    let value = combination;
    const answers = {};
    questions.forEach((_, i) => {
      answers[i] = ["Sim", "Não", "Não sei"][value % 3];
      value = Math.floor(value / 3);
    });
    const result = getChecklistStatus(answers);
    const shouldStop =
      Object.values(answers).includes("Não sei") ||
      [0, 1, 2, 3].some((i) => answers[i] === "Sim") ||
      answers[4] === "Não";
    assert.equal(result.alert, shouldStop, JSON.stringify(answers));
    assert.equal(result.answered, 5);
    assert.equal(
      result.title,
      shouldStop
        ? "Pare e confirme antes de continuar"
        : "Continue conferindo com cuidado",
    );
    if (!shouldStop)
      assert.match(result.message, /não comprova que a mensagem é segura/);
  }
  assert.equal(
    getChecklistStatus({ 0: "Não sei" }).title,
    "Pare e confirme antes de continuar",
  );
  assert.equal(getChecklistStatus({ 4: "Não" }).alert, true);
  assert.equal(getChecklistStatus({ 4: "Sim" }).alert, false);
});
