import { useDeleteApproachMutation } from '@pages/fitness/api/useDeleteApproachMutation';
import { formatDate } from '@shared/lib/formatDate';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ApproachModel } from '@pages/fitness/model/types';

interface ApproachesTableProps {
  approaches?: ApproachModel[];
}

export const ApproachesTable = ({ approaches }: ApproachesTableProps) => {
  const { mutate: deleteApproach, isPending } = useDeleteApproachMutation();

  const handleDeleteApproach = (id: string) => {
    deleteApproach(id);
  };

  if (approaches?.length === 0) {
    return <p className="text-gray-500 italic">Нет добавленных подходов</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-1 px-2 border-b text-center">№</th>
            <th className="py-1 px-2 border-b text-center">
              <span className="hidden sm:inline">Повторения</span>
              <span className="sm:hidden">Повт.</span>
            </th>
            <th className="py-1 px-2 border-b text-center">
              <span className="hidden sm:inline">Вес (кг)</span>
              <span className="sm:hidden">Вес</span>
            </th>
            <th className="py-1 px-2 border-b text-center">
              <span className="hidden sm:inline">Дата</span>
              <span className="sm:hidden">Дата</span>
            </th>
            <th className="py-1 px-2 border-b text-center"></th>
          </tr>
        </thead>
        <tbody>
          {approaches?.map((approach, index) => (
            <tr
              key={approach.id}
              className="hover:bg-gray-50"
            >
              <td className="py-1 px-2 border-b text-center">{index + 1}</td>
              <td className="py-1 px-2 border-b text-center">{approach.reps}</td>
              <td className="py-1 px-2 border-b text-center">{approach.weight}</td>
              <td className="py-1 px-2 border-b text-center">{formatDate(approach.date)}</td>
              <td className="py-1 px-2 border-b text-center">
                <button
                  onClick={() => handleDeleteApproach(approach.id)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50 inline-flex items-center justify-center cursor-pointer"
                  title="Удалить подход"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
