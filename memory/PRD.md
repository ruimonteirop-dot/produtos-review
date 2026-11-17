# Myg Reviews — PRD

## Original problem statement
"Cria uma landing page: Quero construir um site para fazer reviews de produtos. Essas fotos são exemplos de produtos" (3 fotos da Seladora a Vácuo AP-25)

User choices: nome "Myg Reviews"; só o dono escreve reviews; botão "Ver preço" com link por review; estilo colorido e descontraído.

## Architecture
- React (CRA) landing page, framer-motion + lenis, conteúdo em `frontend/src/data/reviews.js`
- Fotos do usuário salvas em `frontend/public/products/` (box/wrapped/unboxed.webp) + 4 fotos stock de exemplo
- FastAPI `POST /api/newsletter` (Mongo collection `newsletter`, email único)

## User personas
- Dono do site (escreve reviews, ganha por links de afiliado)
- Leitor brasileiro procurando opinião sincera antes de comprar

## Core requirements
- Hero cinético, review em destaque com nota/prós/contras/galeria, grid de reviews com filtro, método, newsletter, "Ver preço" por produto

## Implemented (2026-11-17)
- Hero com reveal linha a linha, card 3D tilt + parallax, marquee editorial, review AP-25 com galeria das 3 fotos, bento com filtros, método, Clube Myg (newsletter real no Mongo), footer com aviso de afiliado, logo/favicon SVG

## Backlog
- P0: inserir links reais de "Ver preço" e textos/notas reais (hoje exemplos)
- P1: página individual por review, painel admin para publicar reviews
- P2: SEO, comparativo entre produtos

## Next tasks
- Página completa de cada review; painel para publicar sem editar código
