import { useGetExercisesByUserIdQuery } from '@pages/fitness/api/useGetExercisesByUserIdQuery';
import { ExerciseModel } from '@pages/fitness/model/types';
import { Spinner } from '@shared/ui/Spinner';
import React, { useState } from 'react';

interface ExercisesListProps {
  selectedExerciseId?: string;
  onSelectExercise: (exercise: ExerciseModel) => void;
}

export const ExercisesList: React.FC<ExercisesListProps> = ({ selectedExerciseId, onSelectExercise }) => {
  const [userData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const { data: exercisesByUserId, isFetching } = useGetExercisesByUserIdQuery(parseInt(userData?.id));

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
    <ul className="space-y-2">
      {exercisesByUserId.map((exercise) => (
        <li
          key={exercise.id}
          className={`p-3 rounded-md cursor-pointer transition-colors ${
            selectedExerciseId === exercise.id
              ? 'bg-blue-100 border-l-4 border-blue-500'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => onSelectExercise(exercise)}
        >
          {exercise.name} <span className="text-gray-500">({(exercise as any).sets?.length || 0} подходов)</span>
        </li>
      ))}
    </ul>
  );
};
