import { db } from 'firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaBath, FaBed, FaChair, FaParking, FaShare } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { getAuth } from 'firebase/auth';

// Components
import Spinner from 'components/Spinner';
import Contact from 'components/Contact';
import ListingMap from 'components/ListingMap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

export default function Listing() {
  const auth = getAuth();
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  // Hooks 
  useEffect(() => {
    async function fetchListing() {
      try {
        const docRef = doc(db, 'listings', listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setListing(data);
          setLoading(false);
        } else {
          toast.error('Listing not found');
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error('Could not fetch listing');
      }
    }
    fetchListing();
  }, [listingId, navigate]);

  if (loading) {
    return <Spinner />;
  } 

  return listing && (
    <main>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        navigation
        pagination={{type: 'progressbar', clickable: true}}
        effect='fade'
        autoplay={{delay: 3000}}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className='w-full overflow-hidden h-[300px]'
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: 'cover'
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Share button */}
      <span 
        className='fixed inline-flex items-center justify-center top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12'
        onClick={() => {
          const href = window.location.href;
          navigator.clipboard.writeText(href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className='text-lg text-slate-500' />
        {shareLinkCopied && (
          <span className='fixed z-10 top-[23%] right-[5%] p-2 font-semibold border-2 border-gray-400 rounded-md bg-white'>
            Link Copied
          </span>
        )}
      </span>
      {/* Listing content */}
      <section className='flex flex-col md:flex-row max-w-6xl m-4 p-4 rounded-lg space-y-10 md:space-y-0 md:space-x-5 shadow-lg bg-white lg:last:mx-auto'>
        <div className='w-full'>
          <h4 className='text-2xl font-bold mb-3 text-blue-900 '>
            {listing.name} - $ 
            {' '}
            {listing.offer
              ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            {listing.type === 'rent' && ' / Month'}
          </h4>
          <p className='flex items-center space-x-1 mt-6 mb-3 font-semibold'>
            <MdLocationOn className='text-lg text-green-600' />
            <span>{listing.address}</span>
          </p>
          <div className='flex justify-start items-center space-x-4 mb-5 w-[75%]'>
            <span className='inline-block bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>
              {listing.type === 'rent'? 'Rent': 'Sale'}
            </span>
            {listing.offer && (
              <span className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md'>
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </span>
            )}
          </div>
          <p className='mb-5'>
            <span className='font-semibold '>Description - </span>
            {listing.description}
          </p>          
          <ul className='flex items-baseline space-x-3 sm:space-x-10 md:space-x-5 lg:space-x-10 mb-6 font-semibold text-xs'>
            <li className='inline-flex items-center whitespace-nowrap space-x-1'>
              <FaBed className='text-lg' />
              <span>
                {
                  +listing.bedrooms > 1 
                    ? `${listing.bedrooms} Beds` 
                    : `${listing.bedrooms} Bed`
                }
              </span>
            </li>
            <li className='inline-flex items-center whitespace-nowrap space-x-1'>
              <FaBath className='text-lg' />
              <span>
                {
                  +listing.bathrooms > 1 
                    ? `${listing.bathrooms} Baths` 
                    : `${listing.bathrooms} Bath`
                }
              </span>
            </li>
            <li className='inline-flex items-center whitespace-nowrap space-x-1'>
              <FaParking className='text-lg' />
              <span>
                {
                  listing.parking 
                    ? 'Parking spot' 
                    : 'No parking'
                }
              </span>
            </li>
            <li className='inline-flex items-center whitespace-nowrap space-x-1'>
              <FaChair className='text-lg' />
              <span>
                {
                  listing.furnished 
                    ? 'Furnished' 
                    : 'Not furnished'
                }
              </span>
            </li>
          </ul>
          {/* Contact Landlord */}
          {listing.userRef !== auth.currentUser?.uid 
            && !contactLandlord
            && (
            <button 
              className='px-7 py-3 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:shadow-lg w-full text-center text-white font-medium text-sm rounded shadow-md hover:shadow-lg uppercase transition-colors duration-150 ease-in-out'
              onClick={() => {
                setContactLandlord(true);
              }}
            >
              Contact Landlord
            </button>
          )}
          {contactLandlord && <Contact userId={listing.userRef} listing={listing} />}
        </div>
        <div className='w-full'>
          <ListingMap listing={listing} />
        </div>
      </section>
    </main>
  );
}
