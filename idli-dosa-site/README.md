# Idli Dosa.com

Cafe website with online ordering. Orders are emailed to you.

## 1. Set your email
Open `script.js` and change `ORDER_EMAIL` to your real email address.

## 2. Edit menu, prices, photos
Edit the `MENU` list in `script.js`. Put your own photos in the `images` folder (JPG/PNG/SVG) and update the `img` path. Add your address, hours and phone in the footer of `index.html`.

## 3. Publish on GitHub Pages (free)
1. Create a GitHub account and click New repository (name it e.g. `idli-dosa`, set Public).
2. Click "uploading an existing file", drag in everything from this folder (`index.html`, `style.css`, `script.js`, `images`, `README.md`) and click Commit changes.
3. Go to Settings, then Pages. Under Source choose "Deploy from a branch", branch `main`, folder `/ (root)`, then Save.
4. After about a minute your site is live at `https://YOUR-USERNAME.github.io/idli-dosa/`.

## 4. Use your own domain (optional)
In Settings > Pages, enter your domain under Custom domain, then add the DNS records GitHub shows at your domain registrar.

## 5. Activate email ordering (do this once)
After publishing, place one test order on your live site. FormSubmit sends a confirmation email to `ORDER_EMAIL`; click the link in it. Orders arrive in your inbox from then on.
