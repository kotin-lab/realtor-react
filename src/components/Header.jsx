import React from 'react';
import useAuthStatus from 'hooks/useAuthStatus';

// Components
import NavItem from './NavItem';
import HeaderLogo from './HeaderLogo';

export default function Header() {
  const [loggedIn] = useAuthStatus();

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <HeaderLogo />
        </div>
        <nav>
          <ul className='flex space-x-10'>
            <li>
              <NavItem
                to={'/'}
                text={'Home'}
              />
            </li>
            <li>
              <NavItem
                to={'/offers'}
                text={'Offers'}
              />
            </li>
            <li>
              {
                loggedIn
                  ? <NavItem to={'/profile'} text={'Profile'} />
                  : <NavItem to={'/sign-in'} text={'Sign in'} />
              }
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}
