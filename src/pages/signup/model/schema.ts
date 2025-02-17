import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  name: z.string().min(2, 'Минимум 2 символа'),
});

export type SignupDTO = z.infer<typeof signupSchema>;
