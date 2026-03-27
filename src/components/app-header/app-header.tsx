import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  return <AppHeaderUI userName={user?.name} pathname={pathname} />;
};
