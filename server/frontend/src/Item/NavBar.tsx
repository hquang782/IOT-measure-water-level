import { NavLink } from 'react-router-dom';

export const NavBar = () => {
  return (
    <div>
      <nav className='navbar navbar-expand navbar-dark' style={{ backgroundColor: '#33CCFF' }} >
        <NavLink to={'/'} className='navbar-brand d-flex justify-content-center' style={{ width: '100%' }}> 
          Home
        </NavLink>
        <div className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <NavLink to={'/user'} className='nav-link'>
              User
            </NavLink>
          </li>
        </div>
      </nav>
      <div className='container mt-3'></div>
      {/* <Outlet /> */}
    </div>
  );
};
