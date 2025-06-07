# GameCommunity Indonesia

Landing page untuk komunitas gaming Indonesia dengan fitur PWA (Progressive Web App).

## Fitur

- 🎮 Landing page modern dengan tema gaming
- 📱 PWA dengan install prompt otomatis
- 🚀 Responsif untuk semua device
- ⚡ Fast loading dengan optimasi Vite
- 🌐 Siap deploy ke hosting manapun

## Deploy ke Railway

1. Fork atau clone repository ini
2. Buat akun di [Railway](https://railway.app)
3. Connect repository ke Railway
4. Railway akan otomatis detect dan deploy menggunakan konfigurasi yang sudah ada

### Environment Variables (Opsional)
- `NODE_ENV`: production (otomatis di-set Railway)
- `PORT`: otomatis di-set oleh Railway

## Deploy ke Platform Lain

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Build project: `npm run build`
2. Upload folder `dist` ke Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Heroku
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Push: `git push heroku main`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## PWA Features

- ✅ Manifest.json untuk install app
- ✅ Service Worker untuk offline support
- ✅ Install prompt otomatis
- ✅ Native app experience

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Express.js
- Vite
- PWA APIs

## Kustomisasi

Edit file `client/src/pages/home.tsx` untuk mengubah konten landing page sesuai komunitas gaming Anda.