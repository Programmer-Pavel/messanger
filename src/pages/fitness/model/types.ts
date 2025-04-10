import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string(),
  userId: z.number(),
});

export type ExerciseFormData = z.infer<typeof exerciseSchema>;

export type AddExerciseFormData = Pick<ExerciseFormData, 'name'>;

export const approachSchema = z.object({
  reps: z.number(),
  weight: z.number(),
  exerciseId: z.string(),
  userId: z.number(),
});

export type ApproachFormData = z.infer<typeof approachSchema>;
export interface AddApproachFormData {
  reps: string;
  weight: string;
}

export interface ExerciseModel {
  id: string;
  name: string;
  userId: number;
  createdAt: string;
  approaches: ApproachModel[];
}

export interface ApproachModel {
  id: string;
  reps: number;
  weight: number;
  exerciseId: string;
  userId: number;
  date: string;
}
