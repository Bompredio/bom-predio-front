Bom Prédio — Marketplace Core (Administradoras)
----------------------------------------------

Conteúdo:
- src/pages/Marketplace.jsx         -> listagem de administradoras (public)
- src/pages/AdminProfile.jsx        -> perfil público de uma administradora
- src/pages/RequestForm.jsx         -> formulário "Avaliar/Comparar meu condomínio" (cria lead)
- src/pages/CompareResults.jsx      -> página de comparação (usa leadId)
- supabase/01_create_leads.sql      -> SQL para criar tabela leads
- supabase/00_create_profiles.sql   -> cria tabela profiles e insere seeds
- .env.example                      -> variáveis de ambiente (Supabase)

Como usar:
1. Copie os arquivos para o seu projeto (src/).
2. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env ou Vercel.
3. Execute os SQLs no Supabase SQL editor (00_create_profiles.sql e 01_create_leads.sql).
4. `npm install` (se necessário) e `npm run dev`.
5. Rotas importantes:
   - /           => Marketplace (lista)
   - /admin/:id  => Perfil da administradora
   - /request    => Formulário para criar lead
   - /compare?leadId=<id> => Página de comparação (gera sugestões)
