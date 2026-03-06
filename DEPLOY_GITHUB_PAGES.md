# Deploy AutoMarkLabs to GitHub Pages

## 1) Create a dedicated repo for this site
Use a fresh repository so unrelated workspace changes do not get mixed in.

```powershell
Set-Location "e:\VS Code Projects\AutoMarkLabs"

git init
git add .
git commit -m "Initial AutoMarkLabs website"

git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/automarklabs-site.git
git push -u origin main
```

## 2) Enable GitHub Pages
1. Open your repo on GitHub.
2. Go to `Settings` > `Pages`.
3. Under `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
4. Save.

GitHub gives a default URL like:
`https://<YOUR_USERNAME>.github.io/automarklabs-site/`

## 3) Connect custom domain
`CNAME` file is already added in this project with:

```text
automarklabs.in
```

In repo `Settings` > `Pages`:
- Set `Custom domain` to `automarklabs.in`
- Enable `Enforce HTTPS` after DNS is valid

## 4) DNS records for automarklabs.in
At your domain provider, set these records:

A records for root domain (`@`):
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Optional (recommended) for `www`:
- Type: `CNAME`
- Host: `www`
- Value: `<YOUR_USERNAME>.github.io`

If your DNS provider supports `ALIAS`/`ANAME` for apex, you may use that instead of the four `A` records.

## 5) Verify
- Wait for DNS propagation (usually minutes, up to 24-48 hours).
- Visit:
  - `https://automarklabs.in`
  - `https://www.automarklabs.in` (if configured)

## 6) Future updates

```powershell
Set-Location "e:\VS Code Projects\AutoMarkLabs"
git add .
git commit -m "Update landing page"
git push
```

GitHub Pages redeploys automatically.
