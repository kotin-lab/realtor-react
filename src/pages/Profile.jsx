import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [formData, setFormData] = useState({
    fullName: currentUser.displayName,
    email: currentUser.email
  });
  const { fullName, email } = formData;

  // Handlers
  const handleInputChanged = e => {
    const { value, name } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle sign out clicked
  const handleSignOutClicked = e => {
    // Sign out the user
    auth.signOut();

    // Redirect
    navigate('/');
  };

  return (
    <>
      <section className='max-w-6xl max-auto flex flex-col items-center'>
        <h1 className='mt-6 text-center font-bold text-3xl'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3 '>
          <form>
            <input 
              type='text' 
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
              id='fullName'
              name='fullName'
              value={fullName}
              readOnly={true}
              onChange={handleInputChanged}
              placeholder='Full name'
            />
            <input 
              type='email' 
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
              id='email'
              name='email'
              defaultValue={email}
              readOnly={true}
              placeholder='Email'
            />
            <div className='flex justify-between items-center mb-6 whitespace-nowrap text-sm sm:text-lg'>
              <p className='flex items-center'>
                Do you want to change your name?
                <span 
                  className='cursor-pointer hover:underline text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-2'
                >
                  Edit
                </span>
              </p>
              <span 
                className='cursor-pointer hover:underline text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'
                onClick={handleSignOutClicked}  
              >
                Sign out
              </span>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
