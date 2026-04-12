# 🐾 Nova Vet System

A full-stack veterinary clinic management system built with the MERN stack. Manage pet owners, patients, visits, medical records, and live queue updates — all in one place.

---

## ✨ Features

- **Role-based access control** — Admin, Vet, and Staff roles with different permissions
- **Live queue** — Real-time queue updates powered by Socket.io
- **Owner & pet management** — Register owners and their pets with full profile pages
- **Visit check-in** — Auto-assign queue numbers on check-in
- **Medical records** — Diagnosis, symptoms, treatment, prescriptions, and file attachments
- **Analytics dashboard** — Visit trends, species breakdown, vet performance, top diagnoses
- **Staff management** — Admin can register, update, and deactivate staff accounts
- **Daily queue reset** — Automatic midnight reset via cron job

---

## 🛠 Tech Stack

### Backend

| Package              | Purpose                |
| -------------------- | ---------------------- |
| Node.js + Express.js | Web framework          |
| MongoDB + Mongoose   | Database               |
| Socket.io            | Real-time queue events |
| JSON Web Token (JWT) | Authentication         |
| bcryptjs             | Password hashing       |
| Zod                  | Request validation     |
| Multer               | File uploads           |
| node-cron            | Daily queue reset      |
| Helmet + Morgan      | Security and logging   |

### Frontend

| Package               | Purpose                      |
| --------------------- | ---------------------------- |
| React 19 + Vite       | UI framework                 |
| Tailwind CSS v4       | Styling                      |
| shadcn/ui + Radix UI  | Component library            |
| React Router v7       | Client-side routing          |
| Zustand               | Global state (auth)          |
| TanStack Query v5     | Server state and caching     |
| React Hook Form + Zod | Form handling and validation |
| Socket.io client      | Live queue screen            |
| Axios                 | HTTP client                  |
| Recharts              | Analytics charts             |

---

## 📁 Project Structure

```
nova-vet-system/
├── Backend/
│   ├── Modules/
│   │   ├── auth/           # Login, register, JWT
│   │   ├── users/          # Staff management
│   │   ├── owners/         # Pet owner records
│   │   ├── pets/           # Patient profiles
│   │   ├── visits/         # Visit check-in and status
│   │   ├── queue/          # Live queue management
│   │   ├── records/        # Medical records
│   │   └── analytics/      # Aggregated statistics
│   ├── middlewares/        # Auth and role middleware
│   ├── sockets/            # Socket.io server and events
│   ├── config/             # DB connection and env config
│   ├── jobs/               # Cron jobs
│   ├── utils/              # Helpers and logger
│   ├── uploads/            # Uploaded medical files
│   ├── app.js
│   ├── server.js
│   └── .env
│
└── Frontend/
    └── src/
        ├── pages/          # auth, dashboard, owners, pets,
        │                   # visits, queue, records, analytics, users
        ├── components/     # layout/ and shared/ components
        ├── hooks/          # React Query hooks
        ├── services/       # Axios API calls
        ├── store/          # Zustand auth store
        └── utils/          # socket, formatDate, cn
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nova-vet-system.git
cd nova-vet-system
```

### 2. Set up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. Seed the first admin account

Temporarily open the register route in `Modules/auth/auth.routes.js`:

```javascript
router.post("/register", authController.register);
```

Then send a POST request to `http://localhost:5000/api/auth/register`:

```json
{
  "name": "Super Admin",
  "email": "admin@novavet.com",
  "password": "Admin123456",
  "role": "admin"
}
```

Lock the route back down immediately after:

```javascript
router.post("/register", protect, restrictTo("admin"), authController.register);
```

### 4. Set up the Frontend

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 API Endpoints

### Auth

| Method | Endpoint             | Access        |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Admin only    |
| POST   | `/api/auth/login`    | Public        |
| POST   | `/api/auth/logout`   | Authenticated |
| GET    | `/api/auth/me`       | Authenticated |

### Users

| Method | Endpoint                  | Access |
| ------ | ------------------------- | ------ |
| GET    | `/api/users`              | Admin  |
| PUT    | `/api/users/:id`          | Admin  |
| DELETE | `/api/users/:id`          | Admin  |
| PUT    | `/api/users/:id/password` | Admin  |

### Owners

| Method | Endpoint          | Access       |
| ------ | ----------------- | ------------ |
| GET    | `/api/owners`     | All          |
| GET    | `/api/owners/:id` | All          |
| POST   | `/api/owners`     | Admin, Staff |
| PUT    | `/api/owners/:id` | Admin, Staff |
| DELETE | `/api/owners/:id` | Admin        |

### Pets

| Method | Endpoint                   | Access       |
| ------ | -------------------------- | ------------ |
| GET    | `/api/pets`                | All          |
| GET    | `/api/pets/:id`            | All          |
| GET    | `/api/pets/owner/:ownerId` | All          |
| POST   | `/api/pets`                | Admin, Staff |
| PUT    | `/api/pets/:id`            | Admin, Staff |
| DELETE | `/api/pets/:id`            | Admin        |

### Visits

| Method | Endpoint                 | Access       |
| ------ | ------------------------ | ------------ |
| GET    | `/api/visits/today`      | All          |
| GET    | `/api/visits/:id`        | All          |
| GET    | `/api/visits/pet/:petId` | All          |
| POST   | `/api/visits`            | Admin, Staff |
| PUT    | `/api/visits/:id/status` | Admin, Vet   |
| PUT    | `/api/visits/:id/cancel` | Admin, Staff |

### Queue

| Method | Endpoint           | Access |
| ------ | ------------------ | ------ |
| GET    | `/api/queue/live`  | All    |
| DELETE | `/api/queue/reset` | Admin  |

### Records

| Method | Endpoint                      | Access     |
| ------ | ----------------------------- | ---------- |
| GET    | `/api/records/pet/:petId`     | All        |
| GET    | `/api/records/visit/:visitId` | All        |
| GET    | `/api/records/:id`            | All        |
| POST   | `/api/records`                | Admin, Vet |
| PUT    | `/api/records/:id`            | Admin, Vet |
| POST   | `/api/records/:id/attachment` | Admin, Vet |

### Analytics

| Method | Endpoint                   | Access |
| ------ | -------------------------- | ------ |
| GET    | `/api/analytics/overview`  | Admin  |
| GET    | `/api/analytics/visits`    | Admin  |
| GET    | `/api/analytics/species`   | Admin  |
| GET    | `/api/analytics/vets`      | Admin  |
| GET    | `/api/analytics/queue`     | Admin  |
| GET    | `/api/analytics/diagnoses` | Admin  |

---

## 👥 User Roles

| Role      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| **Admin** | Full access — manage staff, view analytics, delete records            |
| **Vet**   | Medical access — update visit status, create and edit medical records |
| **Staff** | Reception access — register owners and pets, check in visits          |

---

## 🔌 Real-time Events

The queue screen uses Socket.io. When a visit status changes, the server emits a `queue:update` event to all connected clients in the `queue-room` channel. The frontend subscribes and refetches the live queue automatically.

---

## 📦 Available Scripts

### Backend

```bash
npm run dev      # Start with nodemon (development)
npm run start    # Start without nodemon (production)
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

---

## 📄 License

MIT License — feel free to use this project for learning or as a base for your own clinic management system.

---

Built with ❤️ using the MERN stack.
