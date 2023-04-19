import React from 'react';
import spinner from 'assets/svg/spinner.svg'

export default function Spinner() {
  return (
    <div className='bg-black bg-opacity-50 flex items-center justify-center fiexd inset-0 z-40 w-screen h-screen'>
      <div>
        <img src={spinner} alt='Loading...' className='h-24' />
      </div>
    </div>
  )
}
