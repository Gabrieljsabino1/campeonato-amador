# Liga dos Amigos

Portal responsivo para gestão de um campeonato amador de futebol. Inclui ranking público, resenha semanal, galeria de mídia e painel administrativo protegido.

## Rodar localmente

```bash
npm install
npm run dev
```

Sem variáveis de ambiente, a aplicação abre em modo demonstração. O painel pode ser acessado com:

- E-mail: `admin@ligadosamigos.com`
- Senha: `admin123`

Os dados do modo demonstração ficam no `localStorage` do navegador.

## Configurar o Supabase

1. Crie um projeto gratuito no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Em Authentication, crie o usuário administrador.
4. Copie `.env.example` para `.env.local` e informe a URL e a chave pública anon.
5. Reinicie o servidor local.

Com essas variáveis configuradas, o sistema usa automaticamente o banco e a autenticação do Supabase. As políticas RLS permitem leitura pública e reservam as alterações para usuários autenticados.

## Publicar na Vercel

Importe o repositório na Vercel e cadastre as duas variáveis do `.env.example`. O arquivo `vercel.json` já contém o fallback necessário para as rotas do React Router.

## Scripts

- `npm run dev`: ambiente local
- `npm run build`: build de produção
- `npm run lint`: análise estática
- `npm run preview`: prévia do build
