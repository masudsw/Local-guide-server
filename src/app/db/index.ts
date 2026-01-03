import bcrypt from 'bcrypt';
import config from '../../config';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const adminData = {
  name: 'ADMIN',
  email: 'admin@gmail.com', // Using an email format is safer for your Zod/Login logic
  password: 'Admin123',
  role: Role.ADMIN,
};

const seedAdmin = async () => {
  try {
    // 1. Check if an admin already exists
    const isAdminExists = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!isAdminExists) {
      // 2. Hash the password (match the salt rounds used in registration)
      const hashedPassword = await bcrypt.hash(
        adminData.password,
        Number(config.bcrypt_salt_rounds) || 10
      );

      // 3. Create the admin
      await prisma.user.create({
        data: {
          ...adminData,
          password: hashedPassword,
        },
      });
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('ℹ️ Admin user already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

export default seedAdmin;