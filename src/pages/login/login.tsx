import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectIsAuthenticated
} from '../../services/slices/authSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const from = (location.state as { from?: Location } | null)?.from?.pathname;

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from || '/', { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
