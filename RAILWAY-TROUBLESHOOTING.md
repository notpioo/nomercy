# Railway Deployment - Troubleshooting Guide

## Error: "vite: not found" saat Build

**Problem**: Build gagal dengan error `sh: vite: not found`

**Cause**: Railway menggunakan `npm ci --only=production` yang tidak menginstall devDependencies

**Solutions**:

### Option 1: Gunakan Nixpacks Configuration (Recommended)
File `nixpacks.toml` sudah dikonfigurasi dengan:
```toml
[phases.install]
cmds = ["npm ci --include=dev"]
```

### Option 2: Custom Build Command di Railway
Di Railway dashboard, set custom build command:
```bash
npm ci --include=dev && npm run build
```

### Option 3: Move Build Dependencies
Pindahkan dependencies yang diperlukan untuk build dari devDependencies ke dependencies:
```bash
npm install --save vite @vitejs/plugin-react esbuild
npm uninstall --save-dev vite @vitejs/plugin-react esbuild
```

## Environment Variables Setup

**WAJIB setup di Railway:**

1. **NODE_ENV**: `production`
2. **PORT**: (Railway otomatis set)
3. **DATABASE_URL**: (Railway PostgreSQL otomatis set)

4. **Firebase Config** (dari Firebase Console):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

5. **Firebase Admin** (dari Service Account JSON):
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`

## Build Process Verification

Test build locally sebelum deploy:
```bash
# Install semua dependencies
npm ci

# Test build
npm run build

# Test start production
NODE_ENV=production npm start
```

## Common Issues & Fixes

### 1. Build Timeout
- Railway build timeout default 10 menit
- Jika build lama, optimasi dependencies atau gunakan build cache

### 2. Memory Issues
- Railway default 512MB RAM
- Upgrade plan jika aplikasi butuh lebih banyak memory

### 3. Database Connection
- Pastikan DATABASE_URL sudah diset
- Check Firestore rules untuk production

### 4. Static Files
- Railway otomatis serve static files dari `/dist/public`
- Pastikan build output sesuai dengan konfigurasi server

## Monitoring & Logs

1. **Real-time Logs**: Railway dashboard → Deployments → View logs
2. **Metrics**: Memory, CPU, Response time tersedia di dashboard
3. **Health Check**: Endpoint `/` otomatis dicek setiap 30 detik

## Performance Tips

1. **Enable gzip**: Railway otomatis enable
2. **Static file caching**: Set proper cache headers
3. **Database indexing**: Pastikan Firestore queries ter-index
4. **Memory optimization**: Monitor heap usage di logs