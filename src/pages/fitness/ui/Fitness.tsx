import { useState } from 'react';
import { AddExerciseForm } from './components/AddExerciseForm';
import { ExercisesList } from './components/ExercisesList';
import { ExerciseModel } from '../model/types';
import { AddApproachForm } from './components/AddApproachForm';
import { SetsTable } from './components/SetsTable';

export const Fitness = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseModel | undefined>(undefined);

  const handleSelectExercise = (exercise: ExerciseModel) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Отслеживание фитнес-прогресса</h1>

      <AddExerciseForm />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Мои упражнения</h2>
        <ExercisesList
          selectedExerciseId={selectedExercise?.id}
          onSelectExercise={handleSelectExercise}
        />
      </div>

      {selectedExercise && (
        <div className="bg-gray-100 p-4  rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Подходы для "{selectedExercise.name}"</h2>

          <AddApproachForm exerciseId={selectedExercise.id} />

          <SetsTable selectedExerciseId={selectedExercise?.id} />
        </div>
      )}
    </div>
  );
};
