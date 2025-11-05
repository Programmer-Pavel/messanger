import { useGetExercisesByUserIdQuery } from '@pages/fitness/api/useGetExercisesByUserIdQuery';
import { ExerciseModel } from '@pages/fitness/model/types';
import { Spinner } from '@shared/ui/Spinner';
import { useState, useEffect } from 'react';
import { AddApproachForm } from './AddApproachForm';
import { ApproachesTable } from './ApproachesTable';
import { useUserStore } from '@features/auth';
import { cn } from '@/shared/lib/utils';

export const ExercisesList = () => {
  const user = useUserStore((state) => state.user);

  const [selectedExercise, setSelectedExercise] = useState<ExerciseModel | undefined>(undefined);

  const handleSelectExercise = (exercise: ExerciseModel) => {
    setSelectedExercise(exercise);
  };

  const { data: exercisesByUserId, isFetching } = useGetExercisesByUserIdQuery(user ? user.id : undefined);

  // Обновляем selectedExercise при изменении данных exercisesByUserId
  useEffect(() => {
    if (exercisesByUserId && selectedExercise) {
      // Находим обновленную версию выбранного упражнения
      const updatedExercise = exercisesByUserId.find((exercise) => exercise.id === selectedExercise.id);

      // Если упражнение найдено, обновляем его
      if (updatedExercise) {
        setSelectedExercise(updatedExercise);
      }
    }
  }, [exercisesByUserId, selectedExercise]);

  const getExerciseItemClasses = (isSelected: boolean) => {
    return cn('p-3 rounded-md cursor-pointer transition-colors border', {
      'bg-blue-100 border-l-4 border-blue-500 shadow-md': isSelected,
      'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm': !isSelected,
    });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner size={2} />
      </div>
    );
  }

  if (!exercisesByUserId || exercisesByUserId.length === 0) {
    return <p className="text-gray-500 italic">Нет добавленных упражнений</p>;
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Мои упражнения</h2>
        <ul className="space-y-2">
          {exercisesByUserId.map((exercise) => (
            <li
              key={exercise.id}
              className={getExerciseItemClasses(selectedExercise?.id === exercise.id)}
              onClick={() => handleSelectExercise(exercise)}
            >
              <div className="font-medium">{exercise.name}</div>
              <div className="text-sm text-gray-500">{exercise.approaches?.length || 0} подходов</div>
            </li>
          ))}
        </ul>
      </div>

      {selectedExercise && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Подходы для "{selectedExercise.name}"</h2>

          <AddApproachForm exerciseId={selectedExercise.id} />

          <ApproachesTable approaches={selectedExercise?.approaches} />
        </div>
      )}
    </>
  );
};
