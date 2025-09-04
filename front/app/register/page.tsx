'use client';
import InputField from '@/components/auth/InputField';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { validateRegistrationForm } from '@/lib/validation';
import { RegisterInterface } from '@/model/user';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/lib/user';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

export interface RegistrationFormValues extends RegisterInterface {
  password2: string;
}

function RegisterPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<RegistrationFormValues>({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [dirty, setDirty] = useState<Partial<RegistrationFormValues>>({});

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDirty((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  }, []);

  const errors = useMemo(
    () => validateRegistrationForm(formValues),
    [formValues],
  );

  const isValid = Object.keys(errors).length === 0;

  const mutation = useMutation({
    mutationFn: (formValues: RegistrationFormValues) => register(formValues),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formValues, {
      onSuccess: () => router.push('/login'),
      onError: () => alert('회원가입 실패'),
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
          회원가입
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
          label="이메일"
          name="email"
          id="email"
          type="email"
          value={formValues.email}
          onChange={handleFormValues}
          hasError={Boolean(dirty.email) && Boolean(errors.email)}
          helpMessage={dirty.email ? errors.email : ''}
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
        <InputField
          label="비밀번호 재확인"
          name="password2"
          id="password2"
          type="password"
          value={formValues.password2}
          onChange={handleFormValues}
          hasError={Boolean(dirty.password2) && Boolean(errors.password2)}
          helpMessage={dirty.password2 ? errors.password2 : ''}
          onBlur={handleBlur}
        />
        <Button
          type="submit"
          className="bg-sky-900 text-white hover:bg-sky-800 cursor-pointer"
          disabled={!isValid}
        >
          회원가입
        </Button>
      </form>
    </>
  );
}

export default RegisterPage;
