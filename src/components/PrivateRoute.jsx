import useAuthStatus from 'hooks/useAuthStatus';
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import Spinner from 'components/Spinner';

export default function PrivateRoute() {
  const [loggedIn, checkingStatus] = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}
