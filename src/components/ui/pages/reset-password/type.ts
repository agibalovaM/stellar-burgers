import { PageUIProps } from '../common-type';

export type ResetPasswordUIProps = Omit<PageUIProps, 'email'> & {
  password: string;
  token: string;
};
