# Myg Reviews

Site de reviews de produtos com links de afiliado.

- **frontend/**: React (CRA + craco). No build, `scripts/prerender.js` gera HTML estático com SEO
  (título, descrição, Open Graph, dados estruturados `Product` + `Review`) para a página inicial e
  para cada review em `/reviews/<slug>`, mais `sitemap.xml` e `robots.txt`.
- **backend/**: FastAPI + MongoDB. API pública das reviews, painel `/admin`, newsletter e
  upload de fotos para o Cloudflare R2.

## Pôr online

### 1. MongoDB Atlas
Crie um cluster (ou use um existente) e uma base de dados `myg_reviews`. Copie o connection string.
No primeiro arranque o backend cria o utilizador admin e a review do CAREHABI AP-25.

### 2. Cloudflare R2 (fotos do painel)
Crie um bucket `myg-reviews` e um API token com permissão de leitura/escrita nesse bucket.
Sem R2 o site funciona, mas o upload de fotos no painel fica desligado.

### 3. Backend no Render
- New > Web Service > repositório `produtos-review`
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Variáveis de ambiente: ver `backend/.env.example`
- Teste: `https://<o-seu-backend>.onrender.com/api/health` deve responder `{"ok": true}`
- No plano gratuito, ligue o UptimeRobot a `/api/health` para o serviço não adormecer
  (o build do Vercel precisa do backend acordado para gerar as páginas).

### 4. Frontend no Vercel
- New Project > repositório `produtos-review`
- Root directory: `frontend`, framework: Create React App
- Build command: `yarn build` (já inclui a pré-renderização)
- Variáveis: `REACT_APP_BACKEND_URL` (URL do Render, sem barra no fim) e `SITE_URL`
  (domínio público, ex.: `https://www.mygreviews.pt`)
- Depois de ter o domínio do Vercel, ponha-o em `CORS_ORIGINS` no Render.

### 5. Atualizar as páginas automaticamente
No Vercel: Settings > Git > Deploy Hooks > criar um hook. Copie o URL para
`VERCEL_DEPLOY_HOOK_URL` no Render. A partir daí, cada vez que cria, edita ou apaga uma review no
painel, o Vercel faz um novo build e as páginas estáticas ficam atualizadas (1 a 2 minutos).

### 6. Google
Registe o domínio no Google Search Console e submeta `https://<domínio>/sitemap.xml`.

## Escrever uma review
Entre em `/admin`. O campo "Texto da review" aceita:
- `## Título de secção` e `### Subtítulo`
- `- item` para listas
- `**negrito**`
- linha em branco para separar parágrafos

Ative "Produto oferecido para teste" sempre que receber o produto gratuitamente: a página mostra a divulgação.
A nota é opcional; enquanto estiver vazia, a página não mostra nota.

## Desenvolvimento local
```
cd backend && cp .env.example .env   # preencher
pip install -r requirements.txt && uvicorn server:app --reload --port 8001

cd frontend && cp .env.example .env  # REACT_APP_BACKEND_URL=http://localhost:8001
yarn install && yarn start
```
