import bcrypt from "bcrypt";
import { prisma } from "./db"; // ✅ pakai singleton

async function main() {
  const username = "admin";
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    console.log("Admin already exists");
    return;
  }
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: { name: "Administrator", username, password: hash, role: "admin" },
  });
  console.log("Seeded admin: admin / admin123");
}

main().finally(() => prisma.$disconnect());
