import { FC, SyntheticEvent, useEffect } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useForm } from '../../hooks';
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
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
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
    dispatch(loginUser(values));
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
