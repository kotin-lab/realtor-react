import React, { useState } from 'react';
import {
  AiFillEyeInvisible,
  AiFillEye
} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

// Components
import OAuth from 'components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  
  const [showPassword, setShowPassword] = useState(false);

  // Handlers
  const handleInputChanged = e => {
    const { value, name } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submit
  const handleFormSubmitted = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);

      if (userCredentials.user) {
        // Success message
        toast.success('Sign in was successful!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Bad user credentials!');
      console.log(error);
    }
  };

  return (
    <section>
      <h1 className='text-3xl mt-12 font-bold text-center'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl'>
        <div className='md:w-[67%] lg:w-[50%] lg:flex-initial mb-12 lg:mb-0'>
          <img 
            src="https://images.unsplash.com/photo-1633158829799-96bb13cab779?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
            alt="key" 
            className='w-full rounded-2xl'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[50%] lg:flex-1 lg:ml-20'>
          <form onSubmit={handleFormSubmitted}>
            <input 
              type='email' 
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
              id='email'
              name='email'
              value={email}
              onChange={handleInputChanged}
              placeholder='Email'
            />
            <div className='relative mb-6'>
              <input 
                type={showPassword? 'text': 'password'} 
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
                id='password'
                name='password'
                value={password}
                onChange={handleInputChanged}
                placeholder='Password'
              />
              <span className='absolute right-3 top-3'>
                {
                  showPassword 
                    ? (<AiFillEyeInvisible 
                        className='text-xl cursor-pointer' 
                        onClick={() => setShowPassword(false)}
                      />)
                    : (<AiFillEye 
                        className='text-xl cursor-pointer' 
                        onClick={() => setShowPassword(true)}
                      />)
                }  
              </span>            
            </div>
            <div className='flex flex-wrap justify-between items-center text-sm sm:text-lg whitespace-nowrap mb-6'>
              <p>
                Don't have an account?
                {' '}
                <Link 
                  to='/sign-up'
                  className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out'
                >
                  Register
                </Link>  
              </p>
              <p>
                <Link 
                  to='/forgot-password'
                  className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
            >
              Sign in
            </button>
          </form>
          <div className='my-4 flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
            <p className='font-semibold mx-4'>OR</p>
          </div>
          <OAuth />
        </div>
      </div>
    </section>
  )
}
