# Railway PostgreSQL Integration Guide

## Status Database PostgreSQL Railway ✅

Berdasarkan screenshot yang diberikan, PostgreSQL database sudah berhasil di-deploy di Railway dengan konfigurasi:
- **Database**: Postgres
- **Status**: Deployment successful  
- **Region**: asia-southeast1
- **Connection**: `turntable.proxy.rlwy.net`

## Langkah Setup Environment Variables di Railway

### 1. Buka Railway Project Settings
- Masuk ke Railway dashboard
- Pilih project "confident-happiness" 
- Klik tab "Variables"

### 2. Tambahkan Environment Variables

Railway akan otomatis menyediakan `DATABASE_URL` dari PostgreSQL service, tapi pastikan juga ada:

```bash
# Database (Otomatis dari Railway PostgreSQL)
DATABASE_URL=${{ Postgres.DATABASE_URL }}

# Firebase Configuration (Manual input)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Manual input)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Server Configuration
NODE_ENV=production
```

### 3. Koneksi Database di Aplikasi

Aplikasi sudah dikonfigurasi dengan **Hybrid Storage System**:

1. **Primary**: PostgreSQL Railway (untuk performance dan reliability)
2. **Fallback**: Firestore (jika PostgreSQL tidak tersedia)

### 4. Fitur Database yang Sudah Siap

#### PostgreSQL Tables (Auto-created):
- `users` - User management dengan role-based access
- `quizzes` - Quiz system dengan rewards
- `redeem_codes` - Redeem code management
- `game_settings` - Game configuration

#### Data Flow:
```
User Request → PostgreSQL (Primary) → Firestore (Fallback) → Response
```

## Verifikasi Integrasi Database

### Setelah Deploy ke Railway:

1. **Check Logs untuk PostgreSQL Connection**:
```
PostgreSQL connected successfully
PostgreSQL tables created/verified
```

2. **Test Database Endpoints**:
```bash
# Health check
curl https://your-app.railway.app/health

# API test (memerlukan auth)
curl https://your-app.railway.app/api/users/me
```

3. **Monitor di Railway Dashboard**:
- Database metrics (connections, queries)
- Application logs
- Memory dan CPU usage

## Troubleshooting Database

### Problem: PostgreSQL Connection Failed
**Solution**: Pastikan environment variables sudah diset dengan benar di Railway

### Problem: SSL Certificate Error
**Solution**: Railway PostgreSQL menggunakan SSL, sudah dikonfigurasi dalam kode:
```javascript
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
```

### Problem: Tables Not Created
**Solution**: Aplikasi otomatis membuat tables saat startup. Check logs untuk error.

## Database Schema

### Users Table:
```sql
id (VARCHAR PRIMARY KEY)
username (VARCHAR UNIQUE)
password (VARCHAR)
full_name (VARCHAR)
birth_date (DATE)
mercy_coins (INTEGER DEFAULT 1000)
gems (INTEGER DEFAULT 0)
role (VARCHAR DEFAULT 'member')
rank (VARCHAR DEFAULT 'rookie')
rank_level (INTEGER DEFAULT 1)
total_games_played (INTEGER DEFAULT 0)
total_wins (INTEGER DEFAULT 0)
level (INTEGER DEFAULT 1)
created_at (TIMESTAMP)
```

## Migrasi Data (Jika Diperlukan)

Jika ada data existing di Firestore yang perlu dipindah ke PostgreSQL:

1. Export data dari Firestore
2. Transform ke format PostgreSQL
3. Import melalui Railway database console

## Benefits PostgreSQL di Railway

1. **Performance**: Query lebih cepat untuk relational data
2. **Scalability**: Auto-scaling berdasarkan usage
3. **Backup**: Automated daily backups
4. **Monitoring**: Built-in metrics dan alerting
5. **Security**: SSL encryption dan isolated network

Aplikasi NoMercy Gaming Platform siap menggunakan PostgreSQL Railway sebagai database production dengan fallback ke Firestore untuk high availability.