# MongoDB Database Setup for ReviewPulse

ReviewPulse connects to **MongoDB** (MongoDB Atlas or any self-hosted MongoDB instance) using standard MongoDB collections and connection URIs.

---

## 1. Environment Variables (`.env.local`)

Add your MongoDB connection URI to `.env.local` (or in Vercel environment variables):

```env
# MongoDB Connection String (from MongoDB Atlas or localhost)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority

# Optional custom database name (default: reviewpulse)
MONGODB_DB_NAME=reviewpulse

# Optional: Google Gemini API Key for intelligent wording polish
GEMINI_API_KEY=your_gemini_api_key
```

---

## 2. Collections Schema

ReviewPulse automatically creates and manages these 3 collections:

### 1. `users` Collection
Stores registered business owners and staff accounts with hashed passwords:
```json
{
  "_id": "usr_9k2xla18",
  "id": "usr_9k2xla18",
  "email": "doctor@apexdental.com",
  "password_hash": "$2a$10$...",
  "created_at": "2026-10-08T12:00:00.000Z"
}
```

### 2. `profiles` Collection
Stores business profiles, Google direct review links, and review discount offers:
```json
{
  "_id": "biz_87x29la1",
  "id": "biz_87x29la1",
  "user_id": "usr_9k2xla18",
  "business_name": "Apex Dental Care & Implant Clinic",
  "business_category": "Healthcare & Dental",
  "city": "New York / Lahore",
  "google_review_link": "https://search.google.com/local/writereview?placeid=ChIJ...",
  "preferred_language": "en",
  "discount_percentage": 10,
  "created_at": "2026-10-08T12:00:00.000Z",
  "updated_at": "2026-10-08T12:00:00.000Z"
}
```

### 3. `review_requests` Collection
Stores customer review request dispatches, ratings, and AI wording suggestions:
```json
{
  "_id": "req_101",
  "id": "req_101",
  "business_id": "biz_87x29la1",
  "customer_name": "Sarah Johnson",
  "contact_method": "whatsapp",
  "order_service_name": "Teeth Whitening & Cleaning",
  "status": "completed",
  "rating": 5,
  "customer_original_text": "doctor was very gentle and friendly clinic is clean and on time",
  "customer_improved_text": "The doctor was extremely gentle and professional throughout the procedure. Impeccably clean clinic and on time!",
  "created_at": "2026-10-08T12:00:00.000Z",
  "updated_at": "2026-10-08T12:05:00.000Z"
}
```

---

## 3. Recommended Indexes for High Performance

In MongoDB Atlas or `mongosh`:

```javascript
// Index users by unique email
db.users.createIndex({ email: 1 }, { unique: true });

// Index profiles by user_id
db.profiles.createIndex({ user_id: 1 });
db.profiles.createIndex({ id: 1 }, { unique: true });

// Index review requests by business_id and lookup ID
db.review_requests.createIndex({ id: 1 }, { unique: true });
db.review_requests.createIndex({ business_id: 1, created_at: -1 });
```

---

## 4. How to Connect Free MongoDB Atlas (3 Steps)

1. Create a free cluster at **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**.
2. Under **Database Access**, create a user (e.g. `admin` and a password).
3. Under **Network Access**, allow IP `0.0.0.0/0` (allow access from anywhere).
4. Click **Connect** &rarr; **Drivers** &rarr; Copy the connection string.
5. Paste it into `.env.local` as `MONGODB_URI=...`.
