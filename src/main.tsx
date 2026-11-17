import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { questions, getChecklistStatus } from "./checklist.mjs";
import "./style.css";

const scams = [
  {
    title: "Falso familiar no WhatsApp",
    tag: "Uma foto conhecida pode enganar",
    example:
      "“Oi, mãe. Troquei de número. Salve este contato e me ajude com uma conta.”",
    warning:
      "Número novo, pedido de dinheiro e uma história para evitar a ligação.",
    action:
      "Ligue para o contato antigo do familiar. Se não conseguir falar, aguarde e procure outra pessoa da família.",
  },
  {
    title: "Pedido de código de confirmação",
    tag: "Seu código é só seu",
    example: "“Enviei um código para você por engano. Pode me passar?”",
    warning: "Alguém pede o código que chegou por SMS ou pelo aplicativo.",
    action:
      "Não compartilhe o código. Ele pode dar acesso à sua conta. Confira a situação no próprio aplicativo.",
  },
  {
    title: "Falsa central bancária",
    tag: "Desligue e confira",
    example:
      "“Sou da central. Para cancelar uma compra, transfira o saldo para uma conta protegida.”",
    warning: "A ligação pede transferência, senha ou instalação de aplicativo.",
    action:
      "Encerre a ligação. Procure o banco pelo aplicativo que você já usa ou presencialmente. Não use o contato enviado na conversa.",
  },
  {
    title: "Pedido urgente de Pix",
    tag: "A pressa é um sinal de alerta",
    example:
      "“Preciso de um Pix agora. Depois explico. Não conte para ninguém.”",
    warning:
      "Pressão para pagar sem conversar. O nome de quem recebe pode ser diferente.",
    action:
      "Pare antes de pagar. Confirme com a pessoa por outro canal conhecido, mesmo quando o perfil parece verdadeiro.",
  },
  {
    title: "Falso Pix por engano",
    tag: "Confira no extrato",
    example:
      "“Mandei um Pix errado. Devolva para esta outra conta, por favor.”",
    warning: "Um comprovante é usado como prova e a pessoa pede um novo Pix.",
    action:
      "Confira o extrato no aplicativo do banco. Se houver valor recebido por engano, use a função “Devolver” da transação original. Não envie para outra conta. Na dúvida, fale com o banco.",
  },
  {
    title: "Falsas promoções",
    tag: "Um preço bom demais merece pausa",
    example:
      "“Você ganhou! Pague só a taxa de entrega para receber seu prêmio.”",
    warning:
      "Prêmio que você não esperava, taxa antecipada ou oferta que acaba em minutos.",
    action:
      "Não pague a taxa. Abra o aplicativo oficial da loja ou procure seu site por um caminho conhecido para confirmar a oferta.",
  },
  {
    title: "Links suspeitos",
    tag: "Não precisa tocar para conferir",
    example:
      "“Sua entrega foi retida. Acesse o link da mensagem para regularizar.”",
    warning:
      "Cobrança inesperada ou link que pede dados, pagamento ou instalação.",
    action:
      "Não toque no link. Confira a entrega ou o serviço diretamente no aplicativo oficial. Um cadeado no navegador não comprova que um site é confiável.",
  },
  {
    title: "Perfis falsos",
    tag: "Nome e foto não são prova",
    example:
      "“Sou do suporte da loja. Envie seus dados por aqui para receber o reembolso.”",
    warning:
      "Contato inesperado, perfil parecido com o original ou pedido de conversa em outro lugar.",
    action:
      "Não envie dados pela conversa. Abra o aplicativo ou site oficial da loja e procure a área de atendimento.",
  },
  {
    title: "Falsos benefícios",
    tag: "Confira no serviço oficial",
    example:
      "“Seu benefício será suspenso. Pague uma taxa e envie uma foto do documento.”",
    warning:
      "Ameaça de perder um benefício e cobrança para liberar ou manter o pagamento.",
    action:
      "Não pague nem envie documentos. Procure o aplicativo ou atendimento oficial do serviço por conta própria.",
  },
];

const sources = [
  [
    "Banco Central: o que fazer em caso de golpe com Pix",
    "https://www.bcb.gov.br/meubc/faqs/p/o-que-fazer-em-caso-de-golpe-fraude-ou-um-crime",
  ],
  [
    "Banco Central: Mecanismo Especial de Devolução (MED)",
    "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-e-como-funciona-o-mecanismo-especial-de-devolucao-med",
  ],
  [
    "Banco Central: devolução de dinheiro com Pix",
    "https://www.bcb.gov.br/meubc/faqs/p/devolucao-de-dinheiro-com-pix",
  ],
  [
    "Ministério da Justiça: cuidados após clicar em um link suspeito",
    "https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/sofri-um-golpe-e-agora/cliquei-em-links/",
  ],
  [
    "Polícia Civil: cartilha com recuperação do WhatsApp",
    "https://admin.pc.rs.gov.br/upload/arquivos/202312/14103812-cartilha.pdf",
  ],
  [
    "WhatsApp: recuperar uma conta comprometida",
    "https://faq.whatsapp.com/1131652977717250/?category=5245246&locale=pt_BR",
  ],
  [
    "CERT.br: autenticação e proteção de contas",
    "https://cartilha.cert.br/fasciculos/autenticacao/fasciculo-autenticacao-alta.pdf",
  ],
  [
    "CERT.br: golpes e primeiros cuidados",
    "https://cartilha.cert.br/fasciculos/golpes-o-que-fazer/fasciculo-golpes-o-que-fazer-grafica.pdf",
  ],
  [
    "Google: mudar o tamanho do texto no Android",
    "https://support.google.com/accessibility/answer/11183305?hl=pt-br",
  ],
  [
    "Google: ativar o TalkBack",
    "https://support.google.com/accessibility/answer/6007100?hl=pt-BR",
  ],
  [
    "Apple: aumentar o texto no iPhone",
    "https://support.apple.com/pt-br/102453",
  ],
  [
    "Apple: recursos de acessibilidade visual",
    "https://support.apple.com/pt-br/111779",
  ],
];

function Icon({ name = "shield" }: { name?: string }) {
  const paths: Record<string, React.ReactNode> = {
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-5 8-8 10-3-2-8-5-8-10V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    sound: (
      <>
        <path d="m11 5-6 4H2v6h3l6 4zM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    heart: (
      <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 3 11 8 15 5-4 13-10 8-15Z" />
    ),
    phone: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M10 18h4M10 5h4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.shield}
    </svg>
  );
}

function App() {
  const [textSize, setTextSize] = useState(100);
  const [contrast, setContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [speaking, setSpeaking] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const speechAvailable =
    typeof window.speechSynthesis !== "undefined" &&
    typeof window.SpeechSynthesisUtterance !== "undefined";
  const status = getChecklistStatus(answers);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize * 0.0125}rem`;
  }, [textSize]);
  useEffect(() => {
    document.documentElement.dataset.contrast = String(contrast);
  }, [contrast]);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduceMotion);
  }, [reduceMotion]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(preference.matches);
    preference.addEventListener("change", update);
    const stop = () => {
      if (speechAvailable) window.speechSynthesis.cancel();
    };
    window.addEventListener("pagehide", stop);
    return () => {
      stop();
      preference.removeEventListener("change", update);
      window.removeEventListener("pagehide", stop);
    };
  }, [speechAvailable]);

  function listen(id: string) {
    if (!speechAvailable) return;
    window.speechSynthesis.cancel();
    if (speaking === id) {
      setSpeaking("");
      setVoiceMessage("Leitura interrompida.");
      return;
    }
    const area = document.querySelector(`#${id} [data-read]`);
    const content = area
      ? Array.from(area.querySelectorAll("h1,h2,h3,h4,p,summary,legend"))
          .map((element) => element.textContent)
          .join("\n")
      : "";
    if (!content) return;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("pt") && v.localService);
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      setSpeaking((current) => (current === id ? "" : current));
    };
    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      setSpeaking("");
      setVoiceMessage(
        "Não foi possível iniciar a voz. O conteúdo continua disponível em texto.",
      );
    };
    try {
      window.speechSynthesis.speak(utterance);
      setSpeaking(id);
      setVoiceMessage(
        "Leitura iniciada. Use “Interromper leitura” para parar.",
      );
    } catch {
      setSpeaking("");
      setVoiceMessage(
        "A leitura em voz alta não está disponível agora. Você pode ler todo o texto na página.",
      );
    }
  }

  function listenButton(id: string) {
    return (
      <button
        className="listen"
        onClick={() => listen(id)}
        disabled={!speechAvailable}
        aria-describedby={`${id}-title`}
      >
        <Icon name="sound" />
        {!speechAvailable
          ? "Leitura em voz alta indisponível"
          : speaking === id
            ? "Interromper leitura"
            : "Ouvir este conteúdo"}
      </button>
    );
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="accessibility">
        <div className="wrap accessibility-inner">
          <span>Deixe a leitura do seu jeito</span>
          <div className="accessibility-buttons">
            <button
              onClick={() => setTextSize((s) => Math.max(100, s - 10))}
              disabled={textSize === 100}
              aria-label="Reduzir tamanho do texto"
            >
              A− <span>Reduzir</span>
            </button>
            <button
              onClick={() => setTextSize((s) => Math.min(150, s + 10))}
              disabled={textSize === 150}
              aria-label="Aumentar tamanho do texto"
            >
              A+ <span>Aumentar</span>
            </button>
            <button
              aria-pressed={contrast}
              onClick={() => setContrast(!contrast)}
            >
              ◐ Alto contraste
            </button>
            <button
              aria-pressed={reduceMotion}
              onClick={() => setReduceMotion(!reduceMotion)}
            >
              Reduzir movimento
            </button>
          </div>
        </div>
      </div>
      <header className="header wrap">
        <a
          href="#inicio"
          className="brand"
          aria-label="Sonhar Digital — início"
        >
          <span className="brand-symbol">
            <Icon />
          </span>
          <span>
            sonhar<span className="brand-light">digital</span>
            <small>SEGURANÇA COM MAIS CONFIANÇA</small>
          </span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#golpes">Conheça os golpes</a>
          <a href="#checklist">Verifique uma mensagem</a>
          <a href="#ajuda" className="nav-help">
            Preciso de ajuda <Icon name="arrow" />
          </a>
        </nav>
      </header>
      <main id="conteudo" tabIndex={-1}>
        <section
          className="hero wrap"
          id="inicio"
          aria-labelledby="inicio-title"
        >
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="small-dot" /> GUIA DE SEGURANÇA DIGITAL
            </div>
            <div data-read>
              <h1 id="inicio-title">
                Proteja-se de
                <br /> golpes digitais<span className="title-dot">.</span>
              </h1>
              <p className="hero-description">
                Mais calma para usar a internet.
                <br />
                Mais confiança para fazer suas escolhas.
              </p>
              <p>
                Aprenda a reconhecer mensagens suspeitas, cuidar dos seus dados
                e encontrar ajuda. Um passo de cada vez, no seu ritmo.
              </p>
            </div>
            <div className="hero-actions">
              <a className="button primary" href="#golpes">
                Conhecer os golpes <Icon name="arrow" />
              </a>
              <a className="button secondary" href="#checklist">
                Verificar uma mensagem
              </a>
            </div>
            <a href="#socorro" className="emergency-link">
              Já caí em um golpe <Icon name="arrow" />
            </a>
            {listenButton("inicio")}
          </div>
          <div
            className="hero-visual"
            aria-label="Exemplo fictício: uma mensagem pede dinheiro com urgência. A orientação é parar e confirmar."
          >
            <div className="visual-top">
              <Icon name="heart" />
              <span>
                Cuidar de você também
                <br />é cuidar da sua vida digital.
              </span>
            </div>
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-heading">
                <span className="avatar">?</span>
                <div>
                  Número desconhecido<small>Exemplo fictício</small>
                </div>
              </div>
              <div className="phone-chat">
                <span className="chat-label">MENSAGEM RECEBIDA</span>
                <p>
                  Oi, mãe! Troquei de número.
                  <br />
                  Preciso de um Pix agora.
                  <br />
                  Pode me ajudar?
                </p>
                <span className="chat-label">O QUE FAZER?</span>
                <div className="chat-advice">
                  <Icon />
                  <strong>
                    Pare.
                    <br />
                    Respire.
                    <br />
                    Confirme.
                  </strong>
                </div>
                <p className="phone-tip">
                  Ligue para o número que
                  <br />
                  você já conhece.
                </p>
              </div>
              <div className="phone-bottom" />
            </div>
            <div className="visual-note">
              <span className="note-check">
                <Icon name="check" />
              </span>
              <span>
                Você não precisa decidir
                <br />
                <strong>com pressa.</strong>
              </span>
            </div>
          </div>
        </section>
        <div className="principles wrap">
          <span>
            <Icon name="check" /> Explicações sem complicação
          </span>
          <span>
            <Icon name="check" /> Exemplos do dia a dia
          </span>
          <span>
            <Icon name="check" /> Para aprender no seu ritmo
          </span>
        </div>
        <nav className="section-nav wrap" aria-label="Todas as seções">
          <a href="#golpes">01 · Golpes comuns</a>
          <a href="#checklist">02 · Checklist</a>
          <a href="#protecao">03 · Proteja suas contas</a>
          <a href="#socorro">04 · Após um golpe</a>
          <a href="#celular">05 · Seu celular</a>
          <a href="#ajuda">06 · Onde buscar ajuda</a>
        </nav>

        <section
          className="section wrap"
          id="golpes"
          aria-labelledby="golpes-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 / RECONHEÇA OS SINAIS</div>
              <h2 id="golpes-title">
                A história muda.
                <br />
                Os sinais se repetem.
              </h2>
            </div>
            {listenButton("golpes")}
          </div>
          <div data-read>
            <p className="section-intro">
              Uma mensagem pode parecer verdadeira e ainda ser um golpe. Abra
              cada assunto para ver um exemplo e saber como conferir.
            </p>
            <p className="caption">Todos os exemplos abaixo são fictícios.</p>
            <div className="scam-grid">
              {scams.map((scam, i) => (
                <details className="scam" key={scam.title}>
                  <summary>
                    <span className="scam-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <h3>{scam.title}</h3>
                      <span className="scam-tag">{scam.tag}</span>
                    </span>
                    <span className="expand-mark" aria-hidden="true" />
                  </summary>
                  <div className="scam-body">
                    <p className="example">
                      <strong>Exemplo fictício</strong>
                      {scam.example}
                    </p>
                    <h4>Sinais de alerta</h4>
                    <p>{scam.warning}</p>
                    <h4>Como confirmar com segurança</h4>
                    <p>{scam.action}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="checklist-section"
          id="checklist"
          aria-labelledby="checklist-title"
        >
          <div className="wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow">02 / UMA PAUSA ANTES DE AGIR</div>
                <h2 id="checklist-title">
                  Recebeu uma mensagem?
                  <br />
                  Vamos conferir juntos.
                </h2>
              </div>
              {listenButton("checklist")}
            </div>
            <div className="checklist-layout" data-read>
              <div className="checklist-guide">
                <span className="large-icon">
                  <Icon />
                </span>
                <h3>Na dúvida, pare e confirme.</h3>
                <p>
                  Pense na mensagem que você recebeu e responda às perguntas ao
                  lado.
                </p>
                <p>
                  Você não precisa copiar a mensagem nem informar seus dados.
                </p>
                <p className="caption">
                  As respostas ficam apenas nesta página e somem ao recarregar
                  ou reiniciar. Este guia não analisa mensagens nem garante que
                  sejam seguras.
                </p>
              </div>
              <div className="checklist-panel">
                <div className="checklist-progress">
                  <span>Seu checklist</span>
                  <span>
                    {status.answered} de {questions.length} respondidas
                  </span>
                </div>
                <div className="progress-track" aria-hidden="true">
                  <span
                    style={{
                      width: `${(status.answered / questions.length) * 100}%`,
                    }}
                  />
                </div>
                {questions.map((q, i) => (
                  <fieldset key={q.text}>
                    <legend>
                      <span className="question-number">{i + 1}.</span> {q.text}
                    </legend>
                    <div className="answer-options">
                      {["Sim", "Não", "Não sei"].map((answer) => (
                        <label key={answer}>
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={answer}
                            checked={answers[i] === answer}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [i]: answer,
                              }))
                            }
                          />
                          <span>{answer}</span>
                        </label>
                      ))}
                    </div>
                    {answers[i] !== undefined && (
                      <p className="answer-advice">
                        {answers[i] === "Não sei" || answers[i] === q.alert
                          ? q.advice
                          : i === 4
                            ? "Mantenha a conferência no canal conhecido. Nome e foto, sozinhos, não comprovam quem está falando."
                            : "Continue conferindo os outros sinais. Uma resposta isolada não comprova segurança."}
                      </p>
                    )}
                  </fieldset>
                ))}
                <div
                  className={`checklist-result ${status.alert ? "has-alert" : ""}`}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <strong>{status.title}</strong>
                  <p>{status.message}</p>
                </div>
                <button className="reset" onClick={() => setAnswers({})}>
                  Reiniciar checklist
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section wrap"
          id="protecao"
          aria-labelledby="protecao-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                03 / PEQUENOS CUIDADOS, TODOS OS DIAS
              </div>
              <h2 id="protecao-title">
                Sua vida digital
                <br />
                merece cuidado.
              </h2>
            </div>
            {listenButton("protecao")}
          </div>
          <div data-read className="protection-grid">
            <article>
              <span className="topic-number">01</span>
              <h3>Uma senha para cada conta</h3>
              <p>
                Use senhas longas e diferentes. Evite nome, aniversário e
                sequências fáceis. Não entregue sua senha em conversas ou
                ligações.
              </p>
            </article>
            <article>
              <span className="topic-number">02</span>
              <h3>Códigos são só seus</h3>
              <p>
                O código que chega por SMS ou aplicativo pode abrir sua conta.
                Nunca o repasse, mesmo para quem diz ser do suporte.
              </p>
            </article>
            <article>
              <span className="topic-number">03</span>
              <h3>Ative uma proteção extra</h3>
              <p>
                Nas configurações de segurança do aplicativo, procure
                “Verificação em duas etapas”. Ela acrescenta outra etapa para
                entrar. Peça ajuda de alguém de confiança, se precisar.
              </p>
            </article>
            <article>
              <span className="topic-number">04</span>
              <h3>Documentos e dinheiro: confira antes</h3>
              <p>
                Não envie fotos de documentos em conversas inesperadas. Antes de
                transferir dinheiro, confirme o pedido por um contato que você
                já conhece. Foto e voz podem ser falsificadas.
              </p>
            </article>
          </div>
        </section>

        <section
          className="help-section"
          id="socorro"
          aria-labelledby="socorro-title"
        >
          <div className="wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow">04 / VOCÊ PODE PEDIR AJUDA</div>
                <h2 id="socorro-title">
                  Caiu em um golpe?
                  <br />
                  Vamos por partes.
                </h2>
              </div>
              {listenButton("socorro")}
            </div>
            <div data-read>
              <p className="section-intro">
                Golpes podem acontecer com qualquer pessoa. Não tenha vergonha
                de buscar apoio. Agir logo pode ajudar a reduzir o prejuízo.
              </p>
              <ol className="steps">
                <li>
                  <h3>Interrompa o contato</h3>
                  <p>
                    Não responda mais, não envie dinheiro e não siga novas
                    instruções da pessoa. Se houver ligação, desligue.
                  </p>
                </li>
                <li>
                  <h3>Guarde os registros e peça apoio</h3>
                  <p>
                    Salve conversas, comprovantes, nomes de perfis e datas. Peça
                    ajuda a alguém de confiança. Depois de guardar os registros,
                    denuncie e bloqueie o perfil no aplicativo.
                  </p>
                </li>
                <li>
                  <h3>Fale com seu banco ou com a plataforma</h3>
                  <p>
                    Abra o aplicativo oficial por conta própria ou procure
                    atendimento presencial. Não use links ou contatos da
                    mensagem suspeita. Informe o que aconteceu e guarde o
                    protocolo.
                  </p>
                </li>
                <li>
                  <h3>Registre um boletim de ocorrência</h3>
                  <p>
                    Procure uma unidade da Polícia Civil. Quando disponível, use
                    a delegacia virtual oficial do seu estado. Leve ou anexe os
                    registros do golpe. Não espere o boletim para avisar o
                    banco.
                  </p>
                </li>
              </ol>
              <div className="recovery-grid">
                <article>
                  <span className="recovery-label">SE HOUVE UM PIX</span>
                  <h3>Conteste a transferência</h3>
                  <p>
                    Avise seu banco imediatamente e peça a análise pelo
                    Mecanismo Especial de Devolução (MED). Procure a opção de
                    contestar o Pix no aplicativo oficial. A devolução depende
                    da análise e não é garantida.
                  </p>
                  <p>
                    O pedido de MED pode ser registrado em até 80 dias da
                    transferência. Faça o pedido o quanto antes.
                  </p>
                  <a href={sources[1][1]}>
                    Entenda o MED no Banco Central <Icon name="arrow" />
                  </a>
                </article>
                <article>
                  <span className="recovery-label">SE PERDEU UMA CONTA</span>
                  <h3>Use a recuperação oficial</h3>
                  <p>
                    No aplicativo ou site oficial, procure a opção de recuperar
                    o acesso. Se a senha foi exposta, troque-a usando um
                    aparelho confiável. Troque também nas contas em que usava a
                    mesma senha.
                  </p>
                  <p>
                    No WhatsApp, registre novamente seu número no aplicativo
                    oficial com o código recebido por SMS ou ligação. Siga as
                    instruções do aplicativo se ele pedir o PIN de duas etapas.
                    Nunca entregue esse código a outra pessoa.
                  </p>
                  <a href={sources[5][1]}>
                    Ver a recuperação oficial do WhatsApp <Icon name="arrow" />
                  </a>
                </article>
              </div>
              <p className="support-note">
                <Icon name="heart" />
                <span>
                  Quem pede ajuda dá um passo importante para se proteger.
                </span>
              </p>
            </div>
          </div>
        </section>

        <section
          className="section wrap"
          id="celular"
          aria-labelledby="celular-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">05 / TECNOLOGIA NO SEU RITMO</div>
              <h2 id="celular-title">
                Seu celular pode ficar
                <br />
                mais fácil de usar.
              </h2>
            </div>
            {listenButton("celular")}
          </div>
          <div data-read>
            <p className="section-intro">
              Os nomes dos menus variam conforme o aparelho e a versão do
              sistema. Peça a alguém de confiança para fazer os ajustes com
              você.
            </p>
            <div className="device-grid">
              <article>
                <Icon name="phone" />
                <h3>Aumente as letras</h3>
                <p>
                  <strong>No Android:</strong> abra Configurações e pesquise
                  “Tamanho da fonte”. Ajuste a barra até ficar confortável.
                </p>
                <p>
                  <strong>No iPhone:</strong> em Ajustes, procure Acessibilidade
                  → Tela e Tamanho do Texto → Texto Maior.
                </p>
              </article>
              <article>
                <Icon name="sound" />
                <h3>Escute o que está na tela</h3>
                <p>
                  <strong>No Android:</strong> procure TalkBack nas
                  configurações de Acessibilidade.
                </p>
                <p>
                  <strong>No iPhone:</strong> procure VoiceOver em Ajustes →
                  Acessibilidade.
                </p>
                <p>
                  Esses recursos mudam os gestos de uso. Ative com alguém que
                  possa ensinar como navegar e desativar.
                </p>
              </article>
              <article>
                <Icon />
                <h3>Instale com ajuda</h3>
                <p>
                  Procure aplicativos na loja oficial do aparelho: Google Play
                  ou App Store. Confira o nome do desenvolvedor.
                </p>
                <p>
                  Peça ajuda a alguém de confiança. Não instale aplicativos
                  enviados por mensagem nem permita acesso remoto a pedido de
                  desconhecidos.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="section help-links wrap"
          id="ajuda"
          aria-labelledby="ajuda-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                06 / VOCÊ NÃO PRECISA RESOLVER SOZINHO
              </div>
              <h2 id="ajuda-title">Onde procurar ajuda</h2>
            </div>
            {listenButton("ajuda")}
          </div>
          <div data-read>
            <p>
              Converse com alguém de confiança. Para resolver um problema,
              procure o banco, a plataforma ou o serviço pelo aplicativo oficial
              ou presencialmente. Use contatos que você já conhece.
            </p>
            <div className="official-links">
              <a href={sources[0][1]}>
                Golpe com Pix: orientação do Banco Central <Icon name="arrow" />
              </a>
              <a href={sources[5][1]}>
                Conta do WhatsApp: recuperação oficial <Icon name="arrow" />
              </a>
              <a href={sources[3][1]}>
                Link suspeito: orientações do Ministério da Justiça{" "}
                <Icon name="arrow" />
              </a>
            </div>
            <p className="caption">
              Esses links levam a páginas públicas externas. Para voltar ao
              guia, use “Voltar” no navegador.
            </p>
          </div>
        </section>

        <section
          className="sources wrap"
          id="fontes"
          aria-labelledby="fontes-title"
        >
          <h2 id="fontes-title">Fontes para continuar aprendendo</h2>
          <p>
            Conteúdo conferido em 17 de novembro de 2026. As orientações e os
            menus dos aplicativos podem mudar.
          </p>
          <details>
            <summary>
              Ver as fontes utilizadas <span aria-hidden="true">+</span>
            </summary>
            <ul>
              {sources.map(([label, url]) => (
                <li key={url}>
                  <a href={url}>{label}</a>
                </li>
              ))}
            </ul>
          </details>
        </section>
        <section
          className="about wrap"
          id="projeto"
          aria-labelledby="projeto-title"
        >
          <div>
            <div className="eyebrow">CONHECIMENTO QUE ACOLHE</div>
            <h2 id="projeto-title">Sobre o projeto</h2>
          </div>
          <div data-read>
            <p>
              Material educativo desenvolvido como projeto de extensão
              universitária de Ciência da Computação para apoiar pessoas idosas
              na prevenção de golpes digitais.
            </p>
            <p className="caption">
              Para aprender, compartilhar e conversar em família. Sem cadastro,
              formulários ou rastreamento.
            </p>
          </div>
          {listenButton("projeto")}
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <a className="brand" href="#inicio">
            <span className="brand-symbol">
              <Icon />
            </span>
            <span>
              sonhar<span className="brand-light">digital</span>
            </span>
          </a>
          <p>
            Uma pausa hoje.
            <br />
            Mais proteção todos os dias.
          </p>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
      </footer>
      <div className="voice-status wrap" role="status" aria-live="polite">
        {voiceMessage}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
