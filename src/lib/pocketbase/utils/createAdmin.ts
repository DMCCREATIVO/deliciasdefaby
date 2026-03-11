import { pb } from '../client';

export const createDefaultAdmin = async () => {
  try {
    await pb.collection('users').create({
      email: 'admin@admin.com',
      password: 'admin12345',
      passwordConfirm: 'admin12345',
      name: 'Admin',
      role: 'admin'
    });
    console.log('Admin user created successfully');
  } catch (error) {
    if (error.status === 400) {
      console.log('Admin user already exists');
      return;
    }
    throw error;
  }
};