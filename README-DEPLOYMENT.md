# NoMercy Gaming Platform - Deployment Guide

## Deploy ke Railway

### Prerequisites:
- Akun GitHub
- Akun Railway.app
- Firebase project dengan Firestore enabled
- Environment variables yang diperlukan

### Langkah-langkah Deploy:

1. **Push kode ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

   **PENTING: Pastikan file berikut sudah ada sebelum push:**
   - `railway.json` - Konfigurasi Railway
   - `nixpacks.toml` - Build configuration  
   - `Procfile` - Process file
   - `.env.example` - Template environment variables
   - `Dockerfile` - Container configuration

2. **Setup Railway**
   - Buka [Railway.app](https://railway.app)
   - Login dengan GitHub
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository NoMercy Gaming Platform

3. **Environment Variables yang Diperlukan**
   Di Railway dashboard, tambahkan environment variables berikut:
   
   **Database (Otomatis dari Railway PostgreSQL):**
   - `DATABASE_URL` - (Railway akan otomatis menyediakan)
   
   **Firebase Configuration:**
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
   
   **Firebase Admin SDK:**
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   
   **Server Configuration:**
   - `NODE_ENV=production`
   - `PORT` - (Railway akan otomatis set)

4. **Tambah PostgreSQL Database**
   - Di Railway dashboard, klik "New"
   - Pilih "Database" → "PostgreSQL"
   - Railway akan otomatis menghubungkan database dengan aplikasi

5. **Deploy**
   - Railway akan otomatis build dan deploy aplikasi
   - Tunggu proses build selesai
   - Aplikasi akan tersedia di domain Railway (.railway.app)

### File Konfigurasi yang Sudah Dibuat:

- `railway.json` - Konfigurasi Railway
- `nixpacks.toml` - Build configuration
- `Procfile` - Process file
- `.env.example` - Template environment variables

### Setelah Deploy:

1. Aplikasi akan tersedia di URL: `https://your-app-name.railway.app`
2. Database PostgreSQL akan otomatis terhubung
3. Pastikan semua environment variables sudah diset dengan benar
4. Test semua fitur aplikasi untuk memastikan berjalan dengan baik

### Firebase Setup:

1. **Buat Firebase Project**
   - Buka Firebase Console
   - Buat project baru
   - Enable Firestore Database
   - Enable Authentication dengan Email/Password

2. **Generate Service Account Key**
   - Project Settings → Service accounts
   - Generate new private key
   - Simpan file JSON yang didownload

3. **Copy Environment Variables**
   - Dari Firebase config, copy semua nilai ke Railway
   - Untuk FIREBASE_ADMIN_PRIVATE_KEY, copy nilai dari file JSON

### Troubleshooting:

- **Build gagal**: Periksa logs di Railway dashboard
- **Dependencies error**: Pastikan semua package ada di package.json
- **Environment variables**: Periksa format dan nilai dengan benar
- **Firebase error**: Pastikan service account key valid
- **Database error**: Pastikan PostgreSQL service connected

### Monitoring:

- Railway menyediakan logs real-time
- Monitor performance melalui Railway dashboard
- Setup alerts untuk downtime atau errors
- Check health endpoint di /

### Tips Optimization:

1. **Performance**: Railway auto-scale berdasarkan traffic
2. **Database**: Gunakan connection pooling untuk PostgreSQL
3. **Monitoring**: Setup alerts untuk response time > 1s
4. **Backup**: Railway otomatis backup database
5. **Custom Domain**: Bisa setup domain sendiri di Railway settings