import { AddExerciseForm } from './components/AddExerciseForm';
import { ExercisesList } from './components/ExercisesList';

export const Fitness = () => {
  return (
    <div className="max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">Фитнес-прогресс</h1>

      <AddExerciseForm />

      <ExercisesList />
    </div>
  );
};
