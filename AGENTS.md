# Projeto Educação Santa Catarina (Projeto_SC)

Apresentação interativa (site estático) da proposta Better Tech & Alumni × Secretaria de Educação de SC: planejamento, calculadora de investimento, produtos/modalidades, KPIs dinâmicos e slides executivos. Detalhes de produto no `README.md`.

## Stack
- **Linguagem:** HTML5 + CSS3 + JavaScript ES6+ (sem framework, sem build).
- **Bibliotecas (via CDN):** Chart.js (gráficos), Google Fonts (Inter).
- **Deploy:** Vercel (site estático — `vercel.json` v2, `public:true`, `cleanUrls`).
- **Package manager:** nenhum (não há `package.json` nem `node_modules`).

## Comandos
- Não há scripts de build/test/lint. É um site estático.
- Para rodar localmente, sirva a pasta, ex.: `python3 -m http.server 8000` e abra `index.html`.
- `add-missing-slides.js` e `investment-breakdown.js` são scripts de geração/ajuste de conteúdo executados pontualmente (`node <arquivo>.js`), não parte do runtime da página.

## Estrutura
- `index.html` — página principal da apresentação (fonte de verdade em produção).
- `script.js` — lógica principal (cálculos, navegação, gráficos, KPIs).
- `styles.css` — estilos principais; `presentation-enhanced.css` e `presentation-fixes.css` complementam.
- `alumni-logo.svg` — identidade visual.
- Arquivos de trabalho/rascunho **ignorados no deploy** (`.vercelignore`): `index-new-structure.html`, `index.html.backup`, `slides-10-11-12.html`, `script-new.js`, `add-missing-slides.js`, `*.md`, `backup/`, `educaia-sc/`.
- `*.md` — especificações e estruturas de curso (documentação, não servidas).

## Convenções de código
- JS vanilla ES6+, sem transpilação — escreva código que rode direto no browser.
- Mantenha os cálculos financeiros e KPIs em `script.js` sincronizados com o que a UI exibe.
- Dependências externas apenas por CDN (Chart.js, fontes).

## Variáveis de ambiente
- Nenhuma. Site estático sem backend nem segredos.

## CI/CD & Deploy
- **Deploy:** Vercel, auto-deploy da `main` (estático).
- **CI:** não há workflows. Para um projeto estático, CI é opcional; se desejado, um PR pode adicionar validação de HTML (ex.: `html-validate`) ou um linter de JS (ESLint) rodando em `install → lint`.

## Boas práticas de PR
- Branches: `feat/…`, `fix/…`, `chore/…`; Conventional Commits.
- PRs pequenos e focados. Checklist: página abre sem erros no console, gráficos e cálculos corretos, **screenshots dos slides alterados**, sem quebrar responsividade.
- Editar `index.html`/`script.js`/`styles.css` (versão em produção), não os backups/`*-new-structure*`.
- ≥1 review, squash merge, `main` sempre deployável.

## Testes
- Não há testes automatizados. Verificação é manual/visual no browser (desktop, tablet, mobile). Confira os 5 seções e os 8 slides executivos após mudanças.

## Segurança & dados
- Sem backend e sem dados pessoais. Ainda assim, não commitar credenciais ou dados internos sensíveis dentro do HTML/JS.
- Números de proposta (valores, metas) são material comercial — cuidado ao tornar o deploy público (`public:true`).

## Gotchas
- Existem **múltiplas variantes** de arquivos (`index.html` vs `index.html.backup` vs `index-new-structure.html`; `script.js` vs `script-new.js`). Só as versões sem sufixo vão para produção — o `.vercelignore` exclui o resto. Edite a variante certa.
- CDNs externos: sem internet os gráficos (Chart.js) e fontes não carregam.
- `vercel.json` usa `cleanUrls` — evite links com `.html` explícito.
