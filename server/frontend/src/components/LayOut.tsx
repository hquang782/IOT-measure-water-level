import { Outlet } from 'react-router-dom';
import { NavBar } from '../Item/NavBar';

export const LayOut = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
