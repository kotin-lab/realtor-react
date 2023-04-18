import useAuthStatus from 'hooks/useAuthStatus';
import React from 'react';
import { Navigate, Outlet } from 'react-router';

export default function PrivateRoute() {
  const [loggedIn, checkingStatus] = useAuthStatus();

  if (checkingStatus) {
    return <h3 className='mt-6 text-center text-3xl'>Loading...</h3>;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}
