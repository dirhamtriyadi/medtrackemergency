# MedTrackEmergency - MVC Architecture

## 📁 Struktur Folder

```
src/
├── controllers/           # Business logic layer
│   ├── auth.controller.ts
│   ├── dashboard.controller.ts
│   └── items.controller.ts
├── middlewares/          # Reusable middleware functions
│   └── auth.middleware.ts
├── routes/               # Route definitions (thin layer)
│   ├── auth.routes.ts
│   ├── dashboard.routes.ts
│   └── items.routes.ts
├── types/                # TypeScript type definitions
│   └── express-session.ts
├── app.ts                # App initialization & configuration
├── db.ts                 # Database connection (Prisma)
└── seed.ts               # Database seeding script
```

## 🎯 MVC Pattern Implementation

### Controllers

Controllers handle business logic dan berinteraksi dengan database:

- **AuthController**: Login, logout, dan authentication logic
- **DashboardController**: Dashboard data aggregation & KPI calculation
- **ItemsController**: CRUD operations untuk inventory items

### Middlewares

Reusable middleware functions:

- **requireAuth**: Protect routes yang memerlukan authentication
- **redirectIfAuthenticated**: Redirect logged-in users dari login page
- **attachUserToLocals**: Attach user info ke res.locals untuk views

### Routes

Routes hanya define URL patterns dan connect ke controllers:

```typescript
router.get("/items", requireAuth, ItemsController.index);
```

## 🔐 Authentication Flow

1. User akses `/login`
2. `redirectIfAuthenticated` middleware check session
3. Jika sudah login → redirect ke `/dashboard`
4. Jika belum → tampilkan login form
5. POST `/login` → `AuthController.login` validate & create session
6. Redirect ke `/dashboard`

## 📊 Dashboard Flow

1. User akses `/dashboard`
2. `requireAuth` middleware check authentication
3. `DashboardController.showDashboard` fetch data:
   - Count items by category
   - Find low stock items
   - Find expiring items
4. Render dashboard view dengan data

## 📦 Items CRUD Flow

- **Index**: `GET /items` → Filter & list all items
- **Create**: `GET /items/new` → Show form, `POST /items/new` → Save item
- **Update**: `GET /items/:id/edit` → Show form, `POST /items/:id/edit` → Update item
- **Delete**: `POST /items/:id/delete` → Delete item

## ✅ Best Practices Implemented

1. **Separation of Concerns**: Routes, Controllers, Middlewares terpisah
2. **DRY Principle**: Middleware reusable, tidak ada code duplication
3. **Error Handling**: Try-catch blocks di semua controller methods
4. **Input Validation**: Validate user input sebelum database operations
5. **Type Safety**: Full TypeScript dengan proper types
6. **Comments**: JSDoc comments untuk dokumentasi functions
7. **Async/Await**: Modern async patterns, tidak pakai callbacks
8. **Performance**: Parallel queries dengan Promise.all()

## 🚀 How to Run

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Seed database
npm run seed
```

## 📝 Adding New Features

### 1. Create Controller

```typescript
// src/controllers/example.controller.ts
export class ExampleController {
  static async index(req: Request, res: Response) {
    // Your logic here
  }
}
```

### 2. Create Route

```typescript
// src/routes/example.routes.ts
import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";

const router = Router();
router.get("/", ExampleController.index);
export default router;
```

### 3. Register in app.ts

```typescript
import exampleRoutes from "./routes/example.routes";
app.use("/example", exampleRoutes);
```

## 🔧 Environment Variables

Create `.env` file:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-secret-key-here"
PORT=3000
```

## 📚 Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite dengan Prisma ORM
- **View Engine**: EJS
- **Session**: express-session dengan SQLite store
- **Authentication**: bcrypt untuk password hashing
