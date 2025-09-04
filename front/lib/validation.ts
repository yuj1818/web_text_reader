import { RegistrationFormValues } from '@/app/register/page';
import validator from 'validator';
import { LoginInterface } from '@/model/user';

export const validateRegistrationForm = (
  formValues: RegistrationFormValues,
) => {
  const errors: Partial<RegistrationFormValues> = {};

  if (validator.isEmail(formValues.email) === false) {
    errors.email = '이메일 형식을 확인해주세요';
  }

  if (formValues.password.length < 8) {
    errors.password = '비밀번호를 8글자 이상 입력해주세요';
  }

  if (formValues.password2.length < 8) {
    errors.password2 = '비밀번호를 8글자 이상 입력해주세요';
  } else if (
    validator.equals(formValues.password, formValues.password2) === false
  ) {
    errors.password2 = '비밀번호가 일치하지 않습니다.';
  }

  if (formValues.username.length < 1) {
    errors.username = '아이디를 입력해주세요';
  }

  return errors;
};

export const validateLoginForm = (formValues: LoginInterface) => {
  const errors: Partial<LoginInterface> = {};

  if (formValues.username.trim().length === 0) {
    errors.username = '아이디를 입력해주세요';
  }

  if (formValues.password.trim().length === 0) {
    errors.password = '비밀번호를 입력해주세요';
  }

  return errors;
};
