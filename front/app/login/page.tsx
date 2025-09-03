'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { login, LoginInterface } from '@/utils/user';
import LoadingIndicator from '@/components/common/LoadingIndicator';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation({
    mutationFn: (data: LoginInterface) => login(data),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        username,
        password,
      },
      {
        onSuccess: () => router.push('/'),
        onError: () => alert('로그인 실패'),
      },
    );
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
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500" htmlFor="username">
            아이디
          </label>
          <input
            className="rounded p-4 border border-gray-200 text-black"
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500" htmlFor="password">
            비밀번호
          </label>
          <input
            className="rounded p-4 border border-gray-200 text-black"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="bg-sky-900 text-white hover:bg-sky-800 cursor-pointer"
          disabled={username.trim() === '' || password.trim() === ''}
        >
          로그인
        </Button>
      </form>
    </>
  );
}
