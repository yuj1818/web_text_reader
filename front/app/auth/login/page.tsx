'use client';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { login, LoginInterface } from '@/utils/user';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { validateLoginForm } from '@/utils/validation';
import InputField from '@/components/auth/InputField';

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });

  const [dirty, setDirty] = useState<Partial<LoginInterface>>({});

  const handleFormValues = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  }, []);

  const errors = useMemo(() => validateLoginForm(formValues), [formValues]);

  const isValid = Object.keys(errors).length === 0;

  const mutation = useMutation({
    mutationFn: (formValues: LoginInterface) => login(formValues),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formValues, {
      onSuccess: () => router.push('/'),
      onError: () => alert('로그인 실패'),
    });
  };

  return (
    <>
      {mutation.isPending && <LoadingIndicator />}
      <form
        className="absolute top-1/2 left-1/2 -translate-1/2 bg-neutral-100 w-[30rem] p-8 rounded flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <h1 className="font-bold text-2xl w-full text-center text-black">
          로그인
        </h1>
        <InputField
          label="아이디"
          name="username"
          id="username"
          type="text"
          value={formValues.username}
          onChange={handleFormValues}
          hasError={Boolean(dirty.username) && Boolean(errors.username)}
          helpMessage={dirty.username ? errors.username : ''}
          onBlur={handleBlur}
        />
        <InputField
          label="비밀번호"
          name="password"
          id="password"
          type="password"
          value={formValues.password}
          onChange={handleFormValues}
          hasError={Boolean(dirty.password) && Boolean(errors.password)}
          helpMessage={dirty.password ? errors.password : ''}
          onBlur={handleBlur}
        />
        <Button
          type="submit"
          className="bg-sky-900 text-white hover:bg-sky-800 cursor-pointer"
          disabled={!isValid}
        >
          로그인
        </Button>
      </form>
    </>
  );
}
