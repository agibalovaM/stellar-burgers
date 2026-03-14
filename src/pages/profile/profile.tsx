import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useForm } from '../../hooks';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUpdateUserError,
  selectUser,
  updateUser
} from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) || {
    name: '',
    email: ''
  };
  const updateUserError = useSelector(selectUpdateUserError);

  const { values, handleChange, resetForm } = useForm({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    resetForm({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [resetForm, user]);

  const isFormChanged =
    values.name !== user?.name ||
    values.email !== user?.email ||
    !!values.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(values));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    resetForm({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
