import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { getDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase.config';
import { useNavigate, useParams } from 'react-router';

// Components
import Spinner from 'components/Spinner';

export default function EditListing() {
  const auth = getAuth();
  const storage = getStorage();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 0,
    bathrooms: 0,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: '',
    longitude: '',
    images: {}
  });
  const { 
    type, 
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images
  } = formData;

  // Hooks
  useEffect(() => {
    async function fetchListing() {
      try {
        const docRef = doc(db, 'listings', listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setListing(data);
        } else {
          toast.error('Listing does not exist');
          navigate(-1);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error('Could not fetch listing');
      }
    }
    fetchListing();
  }, [listingId, navigate]);

  useEffect(() => {
    if (listing) {
      if (listing.userRef !== auth.currentUser.uid) {
        toast.error("You can't edit this listing");
        navigate('/');
      } else {        
        setFormData({
          ...listing,
          latitude: listing.geolocation.lat,
          longitude: listing.geolocation.lng,
        });
        setLoading(false);
      } 
    }
  }, [listing, auth.currentUser.uid, navigate]);

  // Handlers
  const handleOnChange = e => {
    let bool = null;
    const { type, name, value, files} = e.target;

    // Convert to Boolean
    if (type === 'button' && value === 'true') {
      bool = true;
    }

    if (type === 'button' && value === 'false') {
      bool = false;
    }

    // Files
    if (files) {
      setFormData(prevState => ({
        ...prevState,
        images: files
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: bool ?? value
      }));
    }
  };

  // Handel form submit
  const handleFormSubmit = async e => {
    e.preventDefault();

    // Prevent repeated form submit
    if (loading) return;

    setLoading(true);

    /** Check form fields */
    // Check discounted price
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error('Discounted price need to be less than regular price');
      return;
    }

    // Check max allowed images
    if (images.length > 6) {
      setLoading(false);
      toast.error('Maximum 6 images are allowed');
      return;
    }

    const geolocation = {};
    if (geolocationEnabled) {
      // Implement geolocation functionality here
      // using Google Map Geocode api
      
      setGeolocationEnabled(false);
      setLoading(false);
      toast.info('Geolocation functionality is not implemented yet. Please enter manually in the form.');
      return;
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    /** Upload images */
    // Store image 
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const filename = `${auth.currentUser.uid}-${uuidv4()}-${image.name}`;
        
        // Create the file metadata
        const metadata = {
          contentType: image.type
        };

        // Upload file and metadata to the object `images/${filename}`
        const storageRef = ref(storage, `images/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed', 
          snapshot => {
            // Get task progress, including the number of bytes uploaded
            // and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          error => {
            reject(error);
          },
          () => {
            // Uplaod completd successfully,
            // now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
              resolve(downloadUrl);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map(img => storeImage(img))
    ).catch(error => {
      let message = '';
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          message = "User doesn't have permission to access the object";
          break;
        case 'storage/canceled':
          message = 'User canceled the upload';
          break;
        case 'storage/unknown':
          message = 'Unknown error occurred, inspect error.serverResponse';
          break;
        default:
          message = 'Images not uploaded!';
          break;
      }

      setLoading(false);
      toast.error(message);
      return;
    });
    
    // Copy form data
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid
    };
    // Remove properties that no longer needed
    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    offer || delete formDataCopy.discountedPrice;

    
    /** Update the document */
    try {
      // Update
      const docRef = doc(db, 'listings', listingId);
      await updateDoc(docRef, formDataCopy);

      setLoading(false);
      toast.success('Listing updated');

      // Redirect to listing that just created
      navigate(`/category/${type}/${listingId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Failed to update listing');
    }
  };

  // If Loading, show the <Spinner /> component instead.
  if (loading) {
    return <Spinner />;
  }

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Edit a Listing</h1>
      <form className='space-y-6 mt-6' onSubmit={handleFormSubmit}>
        {/** Sell / Rent */}
        <div>
          <label className='block text-lg font-semibold mb-2'>Sell / Rent</label>
          <div className='flex items-center'>
            <button 
              type='button' 
              name='type'
              value='sell'
              onClick={handleOnChange}
              className={`${type === 'sell'? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Sell
            </button>
            <button 
              type='button' 
              name='type'
              value='rent'
              onClick={handleOnChange}
              className={`${type === 'rent'? 'bg-slate-600 text-white': 'bg-white'} ml-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Rent
            </button>
          </div>
        </div>
        {/** Name */}
        <div>
          <label
            htmlFor='name'
            className='block text-lg font-semibold mb-2'
          >
            Name
          </label>
          <input 
            type='text'
            name='name'
            value={name}
            id='name'
            onChange={handleOnChange}
            placeholder='Name'
            minLength={10}
            maxLength={32}
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
          />
        </div>
        {/** Beds / Baths */}
        <div className='flex items-center space-x-6'>
          <div>
            <label 
              htmlFor='bedrooms'
              className='block text-lg font-semibold mb-2' 
            >
              Beds
            </label>
            <input 
              type='number'
              name='bedrooms'
              id='bedrooms'
              value={bedrooms}
              min={0}
              max={50}
              required
              onChange={handleOnChange}
              className='w-28 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
            />
          </div>
          <div>
            <label 
              htmlFor='bathrooms'
              className='block text-lg font-semibold mb-2' 
            >
              Baths
            </label>
            <input 
              type='number'
              name='bathrooms'
              id='bathrooms'
              value={bathrooms}
              min={0}
              max={50}
              required
              onChange={handleOnChange}
              className='w-28 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
            />
          </div>
        </div>
        {/** Parking spot */}
        <div>
          <label className='block text-lg font-semibold mb-2'>Parking</label>
          <div className='flex items-center'>
            <button 
              type='button' 
              name='parking'
              value={true}
              onClick={handleOnChange}
              className={`${parking? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Yes
            </button>
            <button 
              type='button' 
              name='parking'
              value={false}
              onClick={handleOnChange}
              className={`${!parking? 'bg-slate-600 text-white': 'bg-white'} ml-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              No
            </button>
          </div>
        </div>
        {/** Furnished */}
        <div>
          <label className='block text-lg font-semibold mb-2'>Furnished</label>
          <div className='flex items-center'>
            <button 
              type='button' 
              name='furnished'
              value={true}
              onClick={handleOnChange}
              className={`${furnished? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Yes
            </button>
            <button 
              type='button' 
              name='furnished'
              value={false}
              onClick={handleOnChange}
              className={`${!furnished? 'bg-slate-600 text-white': 'bg-white'} ml-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              No
            </button>
          </div>
        </div>
        {/** Address */}
        <div>
          <label
            htmlFor='address'
            className='block text-lg font-semibold mb-2'
          >
            Address
          </label>
          <textarea 
            name='address'
            value={address}
            id='address'
            onChange={handleOnChange}
            placeholder='Address'
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
          />
        </div>
        {/** Lat / Long */}
        {geolocationEnabled || (
          <div className='flex items-center space-x-6'>
            <div>
              <label 
                htmlFor='latitude'
                className='block text-lg font-semibold mb-2' 
              >
                Latitude
              </label>
              <input 
                type='number'
                name='latitude'
                id='latitude'
                value={latitude}
                min={-90}
                max={90}
                required
                step='any'
                onChange={handleOnChange}
                className='w-36 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
              />
            </div>
            <div>
              <label 
                htmlFor='longitude'
                className='block text-lg font-semibold mb-2' 
              >
                Longitude
              </label>
              <input 
                type='number'
                name='longitude'
                id='longitude'
                value={longitude}
                min={-180}
                max={180}
                required
                step='any'
                onChange={handleOnChange}
                className='w-36 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
              />
            </div>
          </div>
        )}
        {/** Description */}
        <div>
          <label
            htmlFor='description'
            className='block text-lg font-semibold mb-3'
          >
            Description
          </label>
          <textarea 
            name='description'
            value={description}
            id='description'
            onChange={handleOnChange}
            placeholder='Description'
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
          />
        </div>
        {/** Offer */}
        <div>
          <label className='block text-lg font-semibold mb-2'>Offer</label>
          <div className='flex items-center'>
            <button 
              type='button' 
              name='offer'
              value={true}
              onClick={handleOnChange}
              className={`${offer? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Yes
            </button>
            <button 
              type='button' 
              name='offer'
              value={false}
              onClick={handleOnChange}
              className={`${!offer? 'bg-slate-600 text-white': 'bg-white'} ml-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              No
            </button>
          </div>
        </div>
        {/** Regular Price */}
        <div>
          <label 
            htmlFor='regularPrice'
            className='block text-lg font-semibold mb-2' 
          >
            Regular Price
          </label>
          <div className='flex items-baseline space-x-4'>
            <input 
              type='number'
              name='regularPrice'
              id='regularPrice'
              value={regularPrice}
              min={50}
              required
              onChange={handleOnChange}
              className='w-28 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
            />    
            <span hidden={type !== 'rent'} className='text-md whitespace-nowrap'>
              $ / Month
            </span>   
          </div>
        </div>
        {/** Discounted Price */}
        {offer && (
          <div>
            <label 
              htmlFor='discountedPrice'
              className='block text-lg font-semibold mb-2' 
            >
              Discounted Price
            </label>
            <div className='flex items-baseline space-x-4'>
              <input 
                type='number'
                name='discountedPrice'
                id='discountedPrice'
                value={discountedPrice}
                required={offer}
                min={1}
                onChange={handleOnChange}
                className='w-28 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
              />
              <span hidden={type !== 'rent'} className='text-md whitespace-nowrap'>
                $ / Month
              </span>
            </div>
          </div>
        )}
        {/** Images */}
        <div>
          <label htmlFor='images' className='block text-lg font-semibold mb-2'>Images</label>
          <p className='text-sm text-gray-600'>
            The first image will be the cover (max 6)
          </p>
          <input
            type='file'
            name='images'
            id='images'
            onChange={handleOnChange}
            accept='.jpg,.png,.jpeg'
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition ease-in-out duration-200'
          />
        </div>
        {/** Submit button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full px-7 py-3 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-medium text-sm uppercase rounded-md shadow-md hover:shadow-lg focus:shadow-lg transition ease-in-out duration-200'
        >
          Update Listing
        </button>
      </form>
    </main>
  )
}
