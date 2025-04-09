import { useForm } from 'react-hook-form';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';
import { AddExerciseFormData } from '@pages/fitness/model/types';
import { useAddExerciseMutation } from '@pages/fitness/api/useAddExerciseMutation';
import { useState } from 'react';

export const AddExerciseForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<AddExerciseFormData>({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  const [userData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const { mutate, isPending } = useAddExerciseMutation();

  // Наблюдаем за значением поля name
  const nameValue = watch('name');

  // Проверяем, пустое ли значение после удаления пробелов
  const isNameEmpty = !nameValue || nameValue.trim() === '';

  const onSubmit = handleSubmit((data) => {
    // Дополнительная проверка на пустое значение перед отправкой
    if (!data.name.trim() || !userData.id) return;

    mutate(
      {
        name: data.name,
        userId: userData.id,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  });

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Добавить упражнение</h2>
      <form
        onSubmit={onSubmit}
        className="flex gap-2"
      >
        <Input
          control={control}
          name="name"
          placeholder="Название упражнения"
          fullWidth
          className="flex-1"
          containerClassName="w-full"
        />
        <Button
          type="submit"
          isLoading={isSubmitting || isPending}
          disabled={isNameEmpty}
        >
          Добавить
        </Button>
      </form>
    </div>
  );
};
