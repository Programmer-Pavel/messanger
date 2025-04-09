import { useForm } from 'react-hook-form';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';
import { AddApproachFormData, ApproachFormData } from '@pages/fitness/model/types';
import { useAddApproachMutation } from '@pages/fitness/api/useAddApproachMutation';
import { useState } from 'react';

interface AddApproachFormProps {
  exerciseId: string;
}

export const AddApproachForm: React.FC<AddApproachFormProps> = ({ exerciseId }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<AddApproachFormData>({
    defaultValues: {
      reps: '',
      weight: '',
    },
    mode: 'onChange',
  });

  const [userData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const { mutate, isPending } = useAddApproachMutation();

  const repsValue = watch('reps');
  const weightValue = watch('weight');

  const isFormEmpty = !repsValue || !weightValue;

  const onSubmit = handleSubmit((data) => {
    if (!userData?.id) return;

    const approachData: ApproachFormData = {
      reps: Number(data.reps),
      weight: Number(data.weight),
      exerciseId,
      userId: userData.id,
    };

    mutate(approachData, {
      onSuccess: () => {
        reset();
      },
    });
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Добавить подход</h3>
      <form
        onSubmit={onSubmit}
        className="flex gap-2 flex-wrap"
      >
        <Input
          showClearButton={false}
          control={control}
          name="reps"
          min={0}
          type="number"
          placeholder="Повторения"
          containerClassName="w-full sm:w-auto"
        />
        <Input
          showClearButton={false}
          control={control}
          name="weight"
          type="number"
          step="0.5"
          min={0}
          placeholder="Вес (кг)"
          containerClassName="w-full sm:w-auto"
        />
        <Button
          type="submit"
          isLoading={isSubmitting || isPending}
          disabled={isFormEmpty}
        >
          Добавить
        </Button>
      </form>
    </div>
  );
};
