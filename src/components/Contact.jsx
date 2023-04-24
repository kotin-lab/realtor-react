import { db } from 'firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Contact({userId, listing}) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  
  // Hooks
  useEffect(() => {
    async function getLandlord() {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLandlord(data);
        } else {
          toast.error('Landlord not found');
        }
      } catch (error) {
        console.log(error);
        toast.error('Could not get landlord data');
      }
    }
    getLandlord();
  }, [userId]);

  // Handlers
  function onChange(e) {
    const { value } = e.target;
    setMessage(value);    
  }

  return landlord && (
    <div>
      <p className='mb-2'>
        Contact{' '}
        <span className='font-medium text-gray-700'>{landlord.fullName}</span> {' '}
         for the {' '}
         <span className='font-medium text-gray-700'>{listing.name.toLowerCase()}</span>
      </p>
      <div>
        <textarea 
          name="message" 
          id="message" 
          cols="30" 
          rows="2" 
          value={message}
          onChange={onChange}
          className='w-full px-4 py-2 text-lg text-gray-700 focus:text-gray-700 focus:bg-white rounded bg-white border-gray-300 focus:border-slate-600 transition duration-150 ease-in-out'
        />
      </div>
      <a 
        href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
        className='inline-block w-full text-center mt-6 px-7 py-3 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 text-white rounded text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition-colors duration-150 ease-in-out'
      >
        Send message
      </a>
    </div>
  );
}
