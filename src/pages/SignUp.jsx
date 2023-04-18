import React, { useState } from 'react';
import {
  AiFillEyeInvisible,
  AiFillEye
} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { 
  doc, 
  serverTimestamp, 
  setDoc 
} from 'firebase/firestore';
import { db } from 'firebase.config';
import { toast } from 'react-toastify';

// Components
import OAuth from 'components/OAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const { fullName, email, password } = formData;

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
  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      updateProfile(auth.currentUser, {
        displayName: fullName
      });
      
      // Copy formData
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      // Writes to document
      const user = userCredential.user; 
      await setDoc(
        doc(db, 'users', user.uid), 
        formDataCopy
      );

      // Success message
      // toast.success('Sign up was successful!');

      // Redirect to home
      // navigate('/');
    } catch (error) {
      // Error message
      toast.error('Something went wrong with the registration!');
    }
  };

  return (
    <section>
      <h1 className='text-3xl mt-12 font-bold text-center'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl'>
        <div className='md:w-[67%] lg:w-[50%] lg:flex-initial mb-12 lg:mb-0'>
          <img 
            src="https://images.unsplash.com/photo-1633158829799-96bb13cab779?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
            alt="key" 
            className='w-full rounded-2xl'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[50%] lg:flex-1 lg:ml-20'>
          <form onSubmit={handleSubmit}>
            <input 
              type='text' 
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
              id='fullName'
              name='fullName'
              value={fullName}
              onChange={handleInputChanged}
              placeholder='Full name'
            />
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
                Have an account?
                {' '}
                <Link 
                  to='/sign-in'
                  className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out'
                >
                  Sign in
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
              Sign up
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
