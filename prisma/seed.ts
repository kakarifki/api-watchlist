import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { loadEnvConfig } from "../src/config/env";

const prisma = new PrismaClient();

async function main() {
  const config = loadEnvConfig();
  
  const email = config.SEED_USER_EMAIL;
  const password = config.SEED_USER_PASSWORD;
  const name = config.SEED_USER_NAME ?? "Default User";

  if (!email || !password) {
    throw new Error("❌ SEED_USER_EMAIL and SEED_USER_PASSWORD must be set in .env");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log("🌱 Seeding finished. User created/updated:", user.email);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
