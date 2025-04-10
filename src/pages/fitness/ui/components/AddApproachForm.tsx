import { useForm } from 'react-hook-form';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { useAddApproachMutation } from '@pages/fitness/api/useAddApproachMutation';
import { AddApproachFormData, ApproachFormData } from '@pages/fitness/model/types';
import { useUserStore } from '@features/auth';

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

  const user = useUserStore((state) => state.user);

  const { mutate, isPending } = useAddApproachMutation();

  const repsValue = watch('reps');
  const weightValue = watch('weight');

  const isFormEmpty = !repsValue || !weightValue;

  const onSubmit = handleSubmit((data) => {
    if (!user?.id) return;

    const approachData: ApproachFormData = {
      reps: Number(data.reps),
      weight: Number(data.weight),
      exerciseId,
      userId: user.id,
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
