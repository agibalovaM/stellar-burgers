import { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useForm } from '../../hooks';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectIsAuthenticated
} from '../../services/slices/authSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const errorText = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email: values.email,
        name: values.userName,
        password: values.password
      })
    );
  };

  return (
    <RegisterUI
      errorText={errorText || ''}
      email={values.email}
      userName={values.userName}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
