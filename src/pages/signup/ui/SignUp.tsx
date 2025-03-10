import { useForm } from 'react-hook-form';
import { Input } from '@shared/ui/Input';
import { useSignupMutation } from '../api/useSignupMutation';
import { SignupDTO, signupSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import chatImg from '@assets/chat.png';

export function Signup() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupDTO>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      password: '',
      email: '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useSignupMutation();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
    });
  });

  return (
    <div className="bg-white flex w-96 max-w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8 border border-gray-200 rounded-lg shadow-md">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={chatImg} className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Создать аккаунт
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <Input control={control} name="name" label="Имя" />

          <Input control={control} name="email" label="Email" />

          <Input
            control={control}
            name="password"
            label="Пароль"
            showPasswordToggle
            type="password"
          />

          <Button type="submit" fullWidth isLoading={isSubmitting || isPending}>
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Уже есть аккаунт?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
