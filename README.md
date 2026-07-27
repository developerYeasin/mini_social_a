# Mini Social Feed App

A full-stack social feed application where users can register, log in, create posts, view a shared feed, like, and comment on posts. Push notifications are delivered via Firebase Cloud Messaging (FCM).

## Tech Stack

*   **Backend:** Node.js, Express.js, Sequelize ORM, MySQL, JWT Authentication, Firebase Admin (FCM).
*   **Mobile:** React Native (0.81), Expo SDK 54, Expo Router (file-based routing), Axios, TypeScript, expo-secure-store, expo-notifications.

---

## Backend Setup

**1. Navigate to the backend directory and install dependencies:**
```bash
cd backend
npm install
```

**2. Environment Variables:**
Create a `.env` file in the `backend` root directory and configure the following:
```env
PORT=5000
DB_HOST=localhost
DB_USER=mini_social_user
DB_PASSWORD=your_password
DB_NAME=social_feed_db
JWT_SECRET=your_jwt_secret_key
expire_time=7d
```

**3. Firebase (for push notifications):**
FCM is initialized in `config/firebase.js`. Provide the Firebase Admin service-account credentials it expects so push notifications can be sent.

**4. Database Setup & Migration:**
Ensure MySQL is running and the database is created. Run migrations to create tables:
```bash
npx sequelize-cli db:migrate
```

**5. Start the Server:**
```bash
npm run dev
```
*The server runs on `http://localhost:5000`.*

---

## Mobile (Frontend) Setup

**1. Navigate to the mobile directory and install dependencies:**
```bash
cd mobile
npm install
```

**2. API Configuration:**
The API base URL is read from `EXPO_PUBLIC_API_URL` (see `src/lib/api.ts`). Set it in a `.env` file inside `mobile`. It must include the `/api/v1` prefix. If testing on a physical device against a local backend, replace `localhost` with your computer's LAN IP.
```env
# .env (mobile)
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000/api/v1
```

**3. Start the Expo Server:**
```bash
npx expo start
```
*Press `a` to run on Android, `i` for iOS, or scan the QR code with the Expo Go app.*

> **Note:** Push notifications use native FCM and require a development/production build (they do not work in Expo Go). A `google-services.json` is required and must match the Android package `com.yeasin.minisocial`.

---

## API Documentation

### Base URL
`http://localhost:5000/api/v1`

### Authentication
Protected routes require the header: `Authorization: Bearer <token>`

**Register**
*   **Method:** `POST`
*   **Endpoint:** `/auth/register`
*   **Body (JSON):**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
*   **Response:** `{ "message": "...", "id": 1, "email": "...", "token": "jwt_token_string" }`

**Login**
*   **Method:** `POST`
*   **Endpoint:** `/auth/login`
*   **Body (JSON):**
    ```json
    {
      "email": "test@example4.com",
      "password": "password123"
    }
    ```
*   **Response:** `{ "token": "jwt_token_string" }`

**Check Token** *(auth)*
*   **Method:** `GET`
*   **Endpoint:** `/auth/checkToken`
*   **Response:** `{ "user": { ... }, "message": "Token is valid" }`

**Save FCM Token** *(auth)*
*   **Method:** `POST`
*   **Endpoint:** `/auth/fcm-token`
*   **Body (JSON):** `{ "fcm_token": "device_fcm_token" }`

### Posts *(all require auth)*

**View Feed**
*   **Method:** `GET`
*   **Endpoint:** `/user/post/get`
*   **Query params:** `page`, `limit`, `search` (optional, filters by author email)
*   **Response:** `{ "posts": [ ... ], "total": 42 }`

**Get a Single Post**
*   **Method:** `GET`
*   **Endpoint:** `/user/post/get/:id`

**Create a Post**
*   **Method:** `POST`
*   **Endpoint:** `/user/post/create`
*   **Body (JSON):** `{ "content": "Your post text goes here" }`

**Update a Post**
*   **Method:** `PUT`
*   **Endpoint:** `/user/post/update/:id`
*   **Body (JSON):** `{ "content": "Updated text" }`

**Delete a Post**
*   **Method:** `DELETE`
*   **Endpoint:** `/user/post/delete/:id`

### Likes *(all require auth)*

**Like a Post**
*   **Method:** `POST`
*   **Endpoint:** `/user/like/like/:id`

**Get Likes for a Post**
*   **Method:** `GET`
*   **Endpoint:** `/user/like/get/:id`

**Unlike a Post**
*   **Method:** `DELETE`
*   **Endpoint:** `/user/like/delete/:id`

### Comments *(all require auth)*

**Add a Comment**
*   **Method:** `POST`
*   **Endpoint:** `/user/comment/create/:post_id`
*   **Body (JSON):** `{ "text": "Your comment text" }`

**Get Comments for a Post**
*   **Method:** `GET`
*   **Endpoint:** `/user/comment/get/:id`
*   **Response:** `{ "comments": [ ... ] }`

**Update a Comment**
*   **Method:** `PUT`
*   **Endpoint:** `/user/comment/update/:id/:cid`

**Delete a Comment**
*   **Method:** `DELETE`
*   **Endpoint:** `/user/comment/delete/:id/:cid`
