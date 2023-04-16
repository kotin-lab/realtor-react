import React from 'react';
import { NavLink } from 'react-router-dom'

export default function NavItem({text, to}) {
  return (
    <NavLink
      to={to}
      className={({isActive, isPending}) => (
        `${isActive && 'text-black !border-b-red-500'} py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent inline-block`
      )}
    >
      {text}
    </NavLink>
  )
}
