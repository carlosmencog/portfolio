# Carlos Menco Portfolio

Astro static portfolio.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable site is generated in `dist/`.

## Hostinger deploy

Deploys are handled by GitHub Actions in `.github/workflows/deploy-hostinger.yml`.

The workflow builds the Astro project in GitHub Actions and uploads only `dist/` to Hostinger. Hostinger does not run the build.

Required GitHub repository secrets:

- `HOSTINGER_FTP_SERVER`
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`
- `HOSTINGER_FTP_DIR`

Use `HOSTINGER_FTP_DIR` for the remote folder, for example `/public_html/`.
