import { db } from 'firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaShare } from 'react-icons/fa';

// Components
import Spinner from 'components/Spinner';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

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
    </main>
  );
}
