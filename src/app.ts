import SQLiteStoreFactory from "connect-sqlite3";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";
import "./types/express-session";

import { attachUserToLocals } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import itemsRoutes from "./routes/items.routes";

dotenv.config();

const app = express();
const SQLiteStore = SQLiteStoreFactory(session);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// Static files
app.use("/public", express.static(path.resolve("public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.db", dir: "." }) as any,
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  }),
);

// Attach user to locals for all views
app.use(attachUserToLocals);

// Routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/items", itemsRoutes);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
