import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Некорректный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  name: z.string().min(2, 'Минимум 2 символа'),
});

export type SignupDTO = z.infer<typeof signupSchema>;

export interface User {
  id: number;
  email: string;
  name: string;
}
