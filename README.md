# Sonhar Digital

**Guia de Segurança Digital para Idosos** — página educativa responsiva, em português do Brasil, construída com React, TypeScript, Vite e CSS. Saída estática, pronta para um novo projeto no Netlify.

Material educativo desenvolvido como projeto de extensão universitária de Ciência da Computação para apoiar pessoas idosas na prevenção de golpes digitais.

## Rodar no computador

Use Node.js 24 LTS e npm. Na pasta do projeto:

```sh
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. Para preparar e visualizar a versão final:

```sh
npm run build
npm run preview
```

O build verifica os tipos com TypeScript e gera `dist/index.html`, `dist/favicon.svg` e os arquivos de JavaScript e CSS em `dist/assets/`. Não abra o HTML com duplo clique: use o servidor de preview ou uma hospedagem estática.

## Testar

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

O teste de lógica percorre as **243 combinações** das cinco perguntas. Verifica também o estado inicial e o tratamento de respostas parciais. Sinais de alerta e dúvidas pedem uma pausa; nenhuma combinação declara a mensagem segura.

Os 11 testes de navegador cobrem o checklist, alteração de respostas, reinício, limpeza ao recarregar, teclado, foco visível, expansão dos nove assuntos, controles de leitura, preferência de movimento do sistema, ausência de coleta, âncoras de navegação e layout. As larguras testadas são 320, 390, 768 e 1440 pixels, com os assuntos abertos e o tamanho do texto no máximo. Também há teste com ampliação CSS de 200% e largura de 640 pixels para conferir reflow.

Se já tiver o Google Chrome instalado, é possível usá-lo sem baixar o Chromium do Playwright. No PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e
```

Em Linux ou macOS:

```sh
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

Os testes iniciam e encerram um servidor temporário na porta 4173. Deixe essa porta livre. Capturas de layout são geradas em `test-results/`, que fica fora do Git.

### Leitura em voz alta

As seções educativas têm “Ouvir este conteúdo” e “Interromper leitura”. O site usa `speechSynthesis`, sem serviço de voz próprio ou biblioteca adicional. Prefere uma voz local em português quando disponível. As vozes, a pronúncia e eventual processamento pelo serviço de voz do navegador dependem do aparelho. O site não solicita nem transmite o texto de mensagens pessoais.

A integração de voz é testada com uma implementação simulada: iniciar, interromper, trocar de seção, manter o foco, tratar erro e lidar com navegador sem suporte. **A reprodução sonora real não foi validada.** Todo o conteúdo permanece disponível em texto.

## Publicar manualmente no Netlify

A publicação deve ser executada por você. Nenhum projeto de hospedagem foi criado ou colocado no ar durante o desenvolvimento.

1. Rode `npm ci` e `npm run build`.
2. Confirme que `dist` contém `index.html`, `favicon.svg` e a pasta `assets`.
3. Entre na sua conta e abra o [Netlify Drop](https://app.netlify.com/drop).
4. Arraste a pasta **`dist`** para criar um **novo projeto**. Não envie a pasta de código nem `node_modules`.
5. Aguarde o endereço gerado. Abra-o em uma janela anônima e no celular.
6. Confira os botões de navegação, os nove assuntos, o checklist, o tamanho do texto, o contraste e a leitura em voz alta. Teste também o zoom de 200% do próprio navegador.

Se estiver usando o arquivo `sonhar-digital-netlify.zip` entregue junto ao projeto, extraia-o primeiro. Ele contém a pasta `dist` já compilada. Envie essa pasta pelo Drop. Gere um novo build depois de qualquer alteração no código.

### Alternativa: conectar o GitHub depois

O repositório é público em [paulo-sempio-neto/sonhar-digital](https://github.com/paulo-sempio-neto/sonhar-digital). Você pode importar esse repositório em **um novo projeto** no Netlify. O arquivo `netlify.toml` já define:

- Comando de build: `npm run build`.
- Pasta de publicação: `dist`.
- Node.js: 24.
- Sem variáveis de ambiente, banco de dados ou configuração de login.

Depois da conexão, novos commits na branch escolhida podem gerar atualizações automáticas conforme a configuração do Netlify. O caminho de publicação manual permanece disponível.

Referências: [publicação por arrastar e soltar](https://docs.netlify.com/deploy/create-deploys/#drag-and-drop) e [configuração pelo arquivo netlify.toml](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Privacidade e acessibilidade

- Sem login, banco de dados, formulários de coleta, cookies de aplicação ou rastreamento.
- Nenhum campo para informar senhas, documentos, telefones ou mensagens.
- Respostas do checklist e preferências de leitura existem somente na memória da página; desaparecem ao recarregar. O checklist também pode ser reiniciado pelo botão.
- Nenhuma chamada de rede é feita ao responder ao checklist. Fontes e recursos visuais são locais; páginas oficiais externas só são abertas ao seguir seus links.
- O provedor de hospedagem pode manter seus registros técnicos de acesso. Isso não equivale a coleta de respostas pelo site.
- Sem dados identificadores da instituição participante no conteúdo, no código ou nos arquivos de publicação.
- Nomes de órgãos públicos, plataformas e fabricantes aparecem somente como serviços envolvidos ou fontes públicas de orientação.
- Estrutura semântica, link para pular ao conteúdo, foco visível, controles nativos de teclado e aviso do checklist com `role="status"` e `aria-live`.
- Texto ajustável entre 100% e 150%, alto contraste e redução de movimento. A preferência de movimento reduzido do sistema continua sendo respeitada pelo CSS.

## Fontes e atualização editorial

Fontes públicas verificadas em **17 de novembro de 2026**. Os exemplos de mensagens são fictícios e não contêm números de telefone, chaves Pix ou links de golpe clicáveis. Os links para ajuda levam ao serviço oficial e abrem na mesma aba.

| Assunto                                        | Fonte                                                                                                                                                                                                                                     |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pix após golpe                                 | [Banco Central: primeiros passos](https://www.bcb.gov.br/meubc/faqs/p/o-que-fazer-em-caso-de-golpe-fraude-ou-um-crime)                                                                                                                    |
| MED, prazo e limites                           | [Banco Central: Mecanismo Especial de Devolução](https://www.bcb.gov.br/meubc/faqs/p/o-que-e-e-como-funciona-o-mecanismo-especial-de-devolucao-med)                                                                                       |
| Pix recebido por engano                        | [Banco Central: devolução de dinheiro com Pix](https://www.bcb.gov.br/meubc/faqs/p/devolucao-de-dinheiro-com-pix)                                                                                                                         |
| Registros, atendimento e boletim de ocorrência | [Ministério da Justiça: link suspeito](https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/sofri-um-golpe-e-agora/cliquei-em-links/)                                                                                        |
| Recuperação de conta                           | [Polícia Civil: cartilha com recuperação do WhatsApp](https://admin.pc.rs.gov.br/upload/arquivos/202312/14103812-cartilha.pdf) e [WhatsApp: conta comprometida](https://faq.whatsapp.com/1131652977717250/?category=5245246&locale=pt_BR) |
| Senhas e duas etapas                           | [CERT.br: autenticação](https://cartilha.cert.br/fasciculos/autenticacao/fasciculo-autenticacao-alta.pdf)                                                                                                                                 |
| Cuidados após golpe                            | [CERT.br: golpes, o que fazer](https://cartilha.cert.br/fasciculos/golpes-o-que-fazer/fasciculo-golpes-o-que-fazer-grafica.pdf)                                                                                                           |
| Android: texto                                 | [Google: texto e exibição](https://support.google.com/accessibility/answer/11183305?hl=pt-br)                                                                                                                                             |
| Android: leitura de tela                       | [Google: TalkBack](https://support.google.com/accessibility/answer/6007100?hl=pt-BR)                                                                                                                                                      |
| iPhone: texto                                  | [Apple: tamanho da fonte](https://support.apple.com/pt-br/102453)                                                                                                                                                                         |
| iPhone: leitura de tela                        | [Apple: acessibilidade visual](https://support.apple.com/pt-br/111779)                                                                                                                                                                    |

Antes de divulgar amplamente, revise os links e as orientações se houver mudança nas regras do Pix, nos aplicativos ou nos sistemas dos aparelhos. A página evita prometer devolução de valores ou classificar uma mensagem como segura.

## Verificação entregue e limites reais

Consulte [TESTES.md](TESTES.md) para o resultado final dos comandos e o escopo da revisão.

Ainda exigem conferência humana: áudio real em cada navegador, leitura com NVDA/TalkBack/VoiceOver, uso em aparelhos físicos, avaliação com pessoas idosas e teste do endereço público depois da publicação manual. Os testes automatizados de reflow não substituem a conferência do zoom do navegador e de tecnologias assistivas reais.

Não há orientação específica aguardando uma fonte oficial. Não foi incluído um link para uma delegacia estadual específica porque o estado de quem lê pode variar; o guia explica as opções presencial e virtual oficial do respectivo estado.
