# ATV1_DEV_WEB — Entrega Unidade 1 (HTML5)

## Objetivo
Entrega da primeira etapa do projeto: estrutura HTML5 semântica com 3 páginas (início, projetos e cadastro), formulários com validação nativa, máscaras de input, responsividade e acessibilidade básica.

## Estrutura
- `index.html` — página institucional.
- `projetos.html` — listagem de projetos e doações.
- `cadastro.html` — formulário de cadastro (voluntário / doador).
- `css/styles.css` — estilos (mobile-first).
- `js/scripts.js` — máscaras e validação extra.
- `assets/images/` — imagens otimizadas (substituir por imagens reais).
- `README.md` — instruções.

## Acessibilidade
- Skip link (`.skip-link`) para pular ao conteúdo.
- Uso de elementos semânticos (`header`, `main`, `section`, `article`, `footer`, `nav`, `address`).
- Formulário com labels, `fieldset/legend` e `aria-*` onde necessário.
- Contraste e foco visível (via `box-shadow`).

## Validação
- HTML5 native (`required`, `pattern`, `type="email"`, etc.).
- Validação extra de CPF em JavaScript (algoritmo mod 11).
- Máscaras para CPF, telefone e CEP via JS.

## Requisitos técnicos da entrega
- Validar HTML no W3C Validator (remova comentários e ajuste conteúdo real).
- Otimizar imagens (WebP/AVIF quando possível) e oferecer `alt` em todas as imagens.
- Publicar no GitHub:
  1. `git init`
  2. `git add .`
  3. `git commit -m "Entrega Unidade 1 — HTML5"`
  4. Criar repositório no GitHub e fazer `git push`.
  5. Habilitar GitHub Pages em `Settings > Pages` apontando para a branch `main` (ou `gh-pages`).

