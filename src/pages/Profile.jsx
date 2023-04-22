import { db } from 'firebase.config';
import { getAuth, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FcHome } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Components
import ListingItem from 'components/ListingItem';

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    fullName: currentUser.displayName,
    email: currentUser.email
  });
  const { fullName, email } = formData;
  const [changeDetails, setChangeDetails] = useState(false);

  //  
  useEffect(() => {
    async function fetchUserListings() {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef, 
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach(doc => {
        listings.push({
          id: doc.id,
          data: doc.data()
        });
      });

      setListings(listings);
      setLoading(false);
    }

    // Fetch user's listings
    fetchUserListings();
  }, [auth.currentUser.uid]);

  // Handlers
  const handleInputChanged = e => {
    const { value, name } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle sign out clicked
  const handleSignOutClicked = async e => {
    try {
      // Sign out the user
      await auth.signOut();

      // Redirect
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  // Submit changeDetails
  const submitChangeDetails = async () => {
    try {
      if (currentUser.displayName !== fullName) {
        // Update displayName in firebase authentication
        await updateProfile(auth.currentUser, {
          displayName: fullName
        });

        // Update name in the firestore too
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, { fullName });
      
        // Success message
        toast.success('Profile details was updated successful!');
      }
    } catch (error) {
      toast.error('Could not update profile details!');
    }
  };

  return (
    <>
      <section className='max-w-6xl max-auto flex flex-col items-center'>
        <h1 className='mt-6 text-center font-bold text-3xl'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3 '>
          <form>
            <input 
              type='text' 
              className={` ${changeDetails && 'bg-red-200 focus:bg-red-200'} w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out`} 
              id='fullName'
              name='fullName'
              value={fullName}
              readOnly={!changeDetails}
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
                  onClick={() => {
                    changeDetails && submitChangeDetails()
                    setChangeDetails(prevState => !prevState)
                  }}
                >
                  {changeDetails ? 'Apply change' : 'Edit'}
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
          <Link
            to={'/listings/create'}
            className='w-full inline-flex rounded-lg justify-center items-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition ease-in-out duration-200 text-white uppercase px-7 py-2 text-sm font-medium shadow-md hover:shadow-lg '
          >
            <FcHome className='rounded-full text-3xl p-1 border-2 bg-red-200 mr-2' />
            Sell or rent your Home
          </Link>
        </div>
      </section>
      {/* My Listings */}
      <section className='max-w-6xl px-3 mt-10 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold'>
              My Listings
            </h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6'>
              {listings.map(listing => (
                <ListingItem 
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
