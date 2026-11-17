# Verificação de entrega

Data: **17 de novembro de 2026**.

## Resultado

| Verificação | Resultado |
| --- | --- |
| Instalação das dependências com npm | Concluída; `package-lock.json` incluído |
| `npm run build` | Aprovado; TypeScript e build de produção do Vite |
| Arquivos finais | `dist/index.html`, `dist/favicon.svg`, JavaScript e CSS presentes |
| `npm test` | Aprovado; 243 combinações completas, estado vazio e respostas parciais |
| `npm run test:e2e`, com `PLAYWRIGHT_CHANNEL=chrome` | 11 testes aprovados no Chrome em modo headless |
| Checklist | Alerta imediato para risco/dúvida, confirmação por outro canal, edição, reinício e limpeza ao recarregar |
| Teclado | Link de salto, foco visível, expansão com Enter, radios com Espaço e setas |
| Acessibilidade | Texto ampliável, contraste alternável e movimento reduzido do sistema e do controle |
| Voz simulada | Iniciar, parar, trocar seção, erro, manutenção do foco e ausência de suporte |
| Responsividade | Larguras de 320, 390, 768 e 1440 px; assuntos abertos e texto a 150%; sem rolagem horizontal |
| Ampliação | Ampliação CSS a 200% e reflow em viewport de 640 px sem rolagem horizontal |
| Privacidade | Sem campos de coleta, formulários, iframes, cookies de aplicação ou gravação em local/session storage; nenhuma requisição externa ao carregar e responder |
| Navegação | Todos os links internos apontam para IDs existentes |
| Conteúdo | Nove assuntos com exemplo fictício, sinal de alerta e próximo passo |
| Revisão editorial | Pix, recuperação de conta e ocorrência conferidos em fontes oficiais brasileiras; links de apoio no site e no README |
| Revisão de identificação | Conteúdo, metadados, código, nomes de arquivos e build sem identificação da instituição participante |
| Inspeção visual | Capturas de computador e celular revisadas |

Um ajuste de quebra de conteúdo em 320 px com texto no máximo foi identificado nos testes e corrigido antes da entrega. As verificações finais passaram após a correção.

A revisão dos arquivos combina inspeção manual e busca por identificadores, contatos e integrações de coleta. Referências públicas ao Banco Central, à Polícia Civil, ao Ministério da Justiça, ao CERT.br e aos fabricantes são fontes de orientação, sem vínculo apresentado com a instituição participante.

## Limites e pendências reais

- A reprodução sonora real precisa ser ouvida em um navegador com uma voz disponível. O teste automatizado de voz usa simulação da API do navegador.
- Não houve ensaio com leitores de tela reais, como NVDA, TalkBack ou VoiceOver, nem avaliação com pessoas idosas.
- Os layouts foram verificados em navegador de computador com tamanhos de viewport diferentes; aparelhos físicos Android e iPhone ainda precisam de conferência.
- O teste automatizado de ampliação usa CSS e viewport equivalente. Recomenda-se conferir também o zoom de 200% do próprio navegador.
- Nenhum endereço de hospedagem foi criado. Janela anônima, funcionamento em rede móvel e configuração do Netlify só poderão ser verificados após sua publicação manual.
- Não há orientação específica mantida no site com fonte oficial pendente de verificação. Os links devem ser revistos se o conteúdo ou as regras dos serviços mudarem.

## Reproduzir

Use os comandos e o procedimento de publicação em [README.md](README.md). O build entregue foi gerado a partir do mesmo código disponibilizado no repositório.
