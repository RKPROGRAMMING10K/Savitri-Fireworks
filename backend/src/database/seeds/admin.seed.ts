import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from '../../modules/auth/entities/admin.entity';
import { Role } from '../../common/enums/role.enum';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const adminRepository = app.get<Repository<Admin>>(getRepositoryToken(Admin));

  const targetEmail = 'admin@savitrifireworks.com';
  const targetPassword = 'Savitri@5252';

  console.log(`Checking admin account for: ${targetEmail}...`);

  const existingAdmin = await adminRepository
    .createQueryBuilder('admin')
    .addSelect('admin.password')
    .where('admin.email = :email', { email: targetEmail })
    .getOne();

  const hashedPassword = await bcrypt.hash(targetPassword, 10);

  if (existingAdmin) {
    existingAdmin.password = hashedPassword;
    existingAdmin.role = Role.ADMIN;
    existingAdmin.isActive = true;
    existingAdmin.name = 'Super Admin';
    await adminRepository.save(existingAdmin);
    console.log(`[SEED] Admin account '${targetEmail}' password updated to: ${targetPassword}`);
  } else {
    const newAdmin = adminRepository.create({
      email: targetEmail,
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.ADMIN,
      isActive: true,
    });
    await adminRepository.save(newAdmin);
    console.log(`[SEED] Admin account '${targetEmail}' created with password: ${targetPassword}`);
  }

  await app.close();
  console.log('[SEED] Admin seeding completed successfully.');
}

seedAdmin().catch((err) => {
  console.error('[SEED] Fatal error seeding admin account:', err);
  process.exit(1);
});

