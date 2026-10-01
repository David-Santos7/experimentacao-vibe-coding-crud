# use-web

Frontend React do CRUD-TCC para listar, criar, consultar, editar e excluir usuários.

## Configuração

```env
VITE_API_URL=http://localhost:3333
```

## Comandos

```bash
npm run dev
npm test
npx tsc --noEmit
npm run lint
npm run format:check
npm run build
```

## Organização

- `src/app`: shell e rotas;
- `src/features/users`: contrato HTTP, componentes e páginas;
- `src/components/ui`: componentes visuais reutilizáveis;
- `src/lib`: cliente HTTP e utilitários;
- `src/styles`: estilos globais Tailwind;
- `src/test`: setup do Vitest/Testing Library.

O frontend usa fetch nativo e não acessa Prisma, PostgreSQL ou variáveis de banco.
