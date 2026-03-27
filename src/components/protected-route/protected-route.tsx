import { ReactElement } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/slices/authSlice';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

type TRouteLocationState = {
  background?: Location;
  from?: Location;
};

export const ProtectedRoute = ({
  element,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const state = location.state as TRouteLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth) {
    return isAuthenticated ? (
      <Navigate to={state?.from?.pathname || '/'} replace />
    ) : (
      element
    );
  }

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
