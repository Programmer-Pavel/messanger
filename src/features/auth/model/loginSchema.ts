import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
