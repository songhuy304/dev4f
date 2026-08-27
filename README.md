## react-antd-typescript-starter

## Scripts

```sh
# only allow pnpm
pnpm install

# start development environment
pnpm run dev

# production environment
pnpm run build

# production environment analyzer
pnpm run analyzer

# eslint fix code
pnpm run fix

# eslint lint code
pnpm run lint

# prettier format code
pnpm run fmt

# test
pnpm run test

# docker nginx deploy
# http://localhost:8000
# docker-compose up -d
docker compose up -d
```

## src

```bash
.
├── assets      # @/assets/xxx assets source
│   ├── FE.png
│   └── react.svg
├── components  # @/components common components
│   ├── Auth    # auth
│   ├── ErrorBoundary  # ErrorBoundary
│   └── Layout  # layout
├── constant    # @/constant constant
├── hooks       # @/hooks
│   ├── useTheme.ts   # theme hooks
│   └── redux.ts # redux hooks
├── main.tsx    # entry
├── services    # @/services  api
├── pages       # pages
│   ├── error   # error page
│   ├── home    # home page
│   ├── login   # login page
│   └── register # register page
├── router.tsx  # router tree
├── sentry.ts   # sentry config
├── store       # redux store
│   ├── index.ts
│   └── features # redux state
├── styles
│   ├── themes      # antd theme file
│   └── theme.scss
├── utils
│   ├── Axios.ts   # axios
│   └── auth.ts
└── vite-env.d.ts
