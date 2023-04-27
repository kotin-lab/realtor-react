import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from 'firebase.config';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination
} from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Components
import Spinner from 'components/Spinner';
import { Link } from 'react-router-dom';

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hooks
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
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
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch listings');
      }
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return listings && (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, EffectFade]}
      slidesPerView={1}
      navigation
      pagination={{type: 'progressbar'}}
      effect='fade'
      autoplay={{delay: 3000}}
    >
      {listings.map(({data, id}) => (
        <SwiperSlide key={id}>
          <Link to={`/category/${data.type}/${id}`}>
            <div
              className='relative w-full h-[300px] overflow-hidden'
              style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: 'cover'
              }}
            >
              <span
                className='absolute left-1 top-3 inline-block font-medium max-w-[90%] bg-cyan-700 text-cyan-100 shadow-lg opacity-90 px-3 py-2 rounded-br-3xl'
              >
                {data.name}
              </span>
              <span
                className='absolute left-1 bottom-3 inline-block font-medium max-w-[90%] bg-red-700 text-red-100 shadow-lg opacity-90 px-3 py-2 rounded-tr-3xl'
              >
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === 'rent' && ' / month'}
              </span>
            </div>
          </Link>
        </SwiperSlide>
        // <h1 key={listing.id}>{listing.data.imgUrls[0]}</h1>
      ))}
    </Swiper>
  );
}
