# Firebase Admin Setup Guide

## 🔐 Setting Up Admin Accounts in Firebase

The admin login system is now integrated with Firebase. Follow these steps to create admin accounts:

---

## **Option 1: Firebase Console (Manual Setup)** ⚙️

### Step 1: Create/Authenticate User

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **VoltSlot** project
3. Go to **Authentication** → Click on user or create new one
4. Note the user's **UID**

### Step 2: Add Admin Role to Firestore

1. Go to **Firestore Database** → **Collections**
2. Find or create the **`users`** collection
3. Click on the user's document (use their UID as the document ID)
4. Add/Edit the following fields:

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "timestamp"
}
```

### Step 3: Verify in Browser

1. Open http://localhost:5173/auth
2. Click **"Login as Admin"** button
3. Enter the admin credentials
4. You'll see: "✓ Admin verified! Redirecting..."
5. Gets redirected to `/admin` dashboard

---

## **Option 2: Firebase CLI (Automated)** 🚀

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
```

### Create Admin User Script
Create `scripts/create-admin.mjs` in your project:

```javascript
import { initializeApp, cert } from 'firebase-admin/app.js';
import { getFirestore } from 'firebase-admin/firestore.js';
import { getAuth } from 'firebase-admin/auth.js';

// Download your service account key from Firebase Console
// Settings → Service Accounts → Generate new private key
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);
const auth = getAuth(app);

async function createAdmin(email, password, name) {
  try {
    // Create auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Add admin role to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: 'admin',
      createdAt: new Date(),
    });

    console.log(`✅ Admin created:`, userRecord.uid);
    return userRecord.uid;
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

// Example: Create admin account
await createAdmin('admin@example.com', 'SecurePassword123', 'Admin User');
```

### Run the Script
```bash
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' node scripts/create-admin.mjs
```

---

## **Firestore Schema for Admin** 📋

### `users` Collection Structure

```
Collection: users
├── Document: {USER_UID}
│   ├── name: "Admin Name" (string)
│   ├── email: "admin@example.com" (string)
│   ├── role: "admin" (string) ← **IMPORTANT: Must be "admin"**
│   └── createdAt: timestamp (Timestamp)
```

### Complete Example
```json
{
  "name": "Mittal Admin",
  "email": "mittal@voltslot.com",
  "role": "admin",
  "createdAt": {
    "_seconds": 1715503200,
    "_nanoseconds": 0
  }
}
```

---

## ✨ Admin Login Flow

1. User goes to http://localhost:5173/auth
2. Clicks **"Login as Admin"** button (shield icon)
3. Redirects to `/admin-auth` page
4. Enters email & password
5. System authenticates with Firebase Auth
6. Checks `users` collection for `role: "admin"`
7. **If Admin:** ✅ Redirects to `/admin` dashboard
8. **If Not Admin:** ❌ Shows error "Access denied: Your account is not an admin account"

---

## 🔒 Security Rules (Optional)

### Firestore Security Rules
Add these rules to prevent non-admins from accessing admin data:

```firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Admin-only collections
    match /admin_data/{document=**} {
      allow read, write: if 
        request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

---

## 🧪 Testing Admin Login

### Test Case 1: Valid Admin
- **Email:** admin@example.com
- **Password:** your_password
- **Expected:** Redirects to `/admin`
- **Check:** User doc has `"role": "admin"`

### Test Case 2: Valid User (Not Admin)
- **Email:** user@example.com
- **Password:** user_password
- **Expected:** Error message "Access denied"
- **Check:** User doc has `"role": "user"` or no role field

### Test Case 3: Invalid Credentials
- **Email:** wrong@example.com
- **Password:** wrong_password
- **Expected:** Firebase auth error
- **Check:** Shows "User not found" or "Wrong password"

---

## 🐛 Troubleshooting

### Issue: "Access denied: Your account is not an admin account"
**Solution:**
1. Check Firebase Console → Firestore → `users` collection
2. Find your user document by email
3. Ensure it has `"role": "admin"` field
4. Save changes and try login again

### Issue: Login works but doesn't redirect to admin
**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Verify the user's `role` field exists in Firestore
3. Clear browser cache and try again
4. Check Firebase authentication is enabled

### Issue: Firebase says "User not found"
**Solution:**
1. First create user in Firebase Authentication
2. Then add their UID as document ID in `users` collection
3. Make sure email matches both places

### Issue: Can't access admin panel even after admin login
**Solution:**
1. Check if you're logged in: Look for user profile in header
2. Navigate manually to http://localhost:5173/admin
3. If "Access Denied" shows, your account isn't admin in Firebase
4. Re-verify your `role` field is `"admin"`

---

## 📞 Quick Checklist

- [ ] Firebase Authentication enabled
- [ ] Firestore database created
- [ ] `users` collection exists
- [ ] Admin user document has `role: "admin"`
- [ ] Dev server running (`npm run dev`)
- [ ] Admin can login at `/admin-auth`
- [ ] Admin redirects to `/admin` after login
- [ ] Regular users are blocked from admin panel

---

## 🔗 Related Documentation

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Database Docs](https://firebase.google.com/docs/firestore)
- [VoltSlot Admin Panel Guide](./ADMIN_SETUP.md)

---

## 📝 Example Admin Accounts

### Development Admin
```json
{
  "name": "Dev Admin",
  "email": "dev-admin@example.com",
  "role": "admin",
  "createdAt": "now"
}
```

### Production Admin
```json
{
  "name": "System Administrator",
  "email": "admin@voltslot-charging.com",
  "role": "admin",
  "createdAt": "now"
}
```

---

## ⚡ Firebase Integration Features

✅ **Real-time Role Verification** - Role checked from Firestore immediately after login  
✅ **Automatic Redirect** - Admin redirected to `/admin` if role verified  
✅ **Error Handling** - Clear error messages if account isn't admin  
✅ **Loading State** - Visual feedback during verification  
✅ **Secure** - Uses Firebase Auth + Firestore rules  

---

## 🚀 Next Steps

1. Create your first admin account in Firebase Console
2. Test login at http://localhost:5173/admin-auth
3. Explore the admin dashboard at http://localhost:5173/admin
4. Configure load thresholds, pricing, and other settings
5. Create more admin accounts as needed

Happy administrating! 🎉
