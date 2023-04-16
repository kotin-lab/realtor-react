import React from 'react'
import { Link } from 'react-router-dom';

export default function HeaderLogo() {
  return (
    <Link to={'/'}>
      <img 
        src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' 
        alt='logo' 
        className='h-5'
      />          
    </Link>
  )
}
