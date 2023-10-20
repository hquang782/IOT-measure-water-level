import { NavLink } from 'react-router-dom';

export const NavBar = () => {
  return (
    <div className='PUBG'>
      <nav className='navbar navbar-expand navbar-dark' style={{ backgroundColor: '#33CCFF' }} >
        <NavLink to={'/'} className='navbar-brand d-flex justify-content-center' style={{ width: '100%' }}> 
          Home
        </NavLink>
      </nav>
      {/* <div className='container mt-3'></div> */}
      {/* <Outlet /> */}
    </div>
  );
};
