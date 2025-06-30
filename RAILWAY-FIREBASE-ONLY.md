# Railway Deployment - Firebase Only Configuration

## Perubahan Arsitektur ✅

Aplikasi NoMercy Gaming Platform telah disederhanakan untuk menggunakan **Firebase/Firestore saja** sebagai database utama untuk mengatasi masalah network di Railway.

### Yang Sudah Dihapus:
- ❌ PostgreSQL dependency (pg, @types/pg)
- ❌ server/postgresql.ts 
- ❌ Hybrid storage sistem
- ❌ DATABASE_URL environment variable
- ❌ Network checks ke PostgreSQL

### Yang Digunakan Sekarang:
- ✅ Firebase Authentication
- ✅ Firestore Database (Real-time NoSQL)
- ✅ No network dependency checking
- ✅ Minimal external connections

## Benefits Firebase-Only:

### 1. **Network Reliability**
- Firebase menggunakan CDN global
- Auto-retry dan connection pooling
- Tidak ada custom network setup

### 2. **Simplified Deployment**
- Tidak perlu setup PostgreSQL di Railway
- Environment variables minimal
- No database migrations

### 3. **Built-in Features**
- Real-time updates
- Auto-scaling
- Built-in security rules
- Offline support

## Environment Variables untuk Railway

Hanya perlu Firebase credentials:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Server Configuration
NODE_ENV=production
```

## Firestore Collections Structure

### Users Collection:
```
users/
  ├── {userId}/
      ├── username: string
      ├── password: string (hashed)
      ├── fullName: string
      ├── birthDate: timestamp
      ├── mercyCoins: number
      ├── gems: number
      ├── role: "member" | "admin"
      ├── rank: string
      ├── rankLevel: number
      ├── totalGamesPlayed: number
      ├── totalWins: number
      └── createdAt: timestamp
```

### Quizzes Collection:
```
quizzes/
  ├── {quizId}/
      ├── title: string
      ├── description: string
      ├── questions: array
      ├── reward: object
      ├── timeLimit: number
      ├── maxAttempts: number
      ├── isActive: boolean
      └── dates: timestamps
```

### Redeem Codes Collection:
```
redeemCodes/
  ├── {codeId}/
      ├── code: string
      ├── title: string
      ├── description: string
      ├── reward: object
      ├── maxUses: number
      ├── currentUses: number
      ├── isActive: boolean
      └── expiresAt: timestamp
```

## Deployment Steps

1. **Push Firebase-only code** ke GitHub
2. **Set Firebase environment variables** di Railway
3. **Deploy aplikasi** - tidak perlu database setup
4. **Test endpoints** - semuanya menggunakan Firestore

## Benefits untuk Production

- **Faster deployment**: Tidak ada database setup
- **Better reliability**: Firebase global infrastructure  
- **Auto-scaling**: Firestore scales automatically
- **Real-time features**: Live updates untuk games
- **Security**: Built-in Firebase security rules

Aplikasi sekarang lebih ringan, reliable, dan mudah di-deploy ke Railway tanpa kompleksitas PostgreSQL yang menyebabkan network failures.