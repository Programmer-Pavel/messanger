import { useForm } from 'react-hook-form';
import { Input } from '@shared/ui/Input';
import { useLoginMutation } from '../api/useLoginMutation';
import { LoginDTO, loginSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
      email: '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useLoginMutation();

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
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Войти в аккаунт
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <Input control={control as any} name="email" label="Email" />

          <Input
            control={control as any}
            name="password"
            label="Пароль"
            showPasswordToggle
            type="password"
          />

          <Button type="submit" fullWidth isLoading={isSubmitting || isPending}>
            Войти
          </Button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Нет аккаунта?{' '}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
