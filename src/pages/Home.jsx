import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from 'firebase.config';

// Components
import Slider from 'components/Slider';
import { Link } from 'react-router-dom';
import ListingItem from 'components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  
  /** Hooks */ 

  // Fetch offer listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef, 
          where('offer', '==', true), 
          orderBy('timestamp', 'desc'), 
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc => {
          listings.push({
            id: doc.id,
            data: doc.data()
          });
          setOfferListings(listings);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetch rent listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef, 
          where('type', '==', 'rent'), 
          orderBy('timestamp', 'desc'), 
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc => {
          listings.push({
            id: doc.id,
            data: doc.data()
          });
          setRentListings(listings);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetch sale listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef, 
          where('type', '==', 'sell'), 
          orderBy('timestamp', 'desc'), 
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc => {
          listings.push({
            id: doc.id,
            data: doc.data()
          });
          setSaleListings(listings);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <>
      <Slider />
      <div className='max-w-6xl mx-auto space-y-6 my-6 px-4'>
        {/* Recent offers */}
        {offerListings && offerListings.length > 0 && (
          <section className=''>
            <h2 className='px-3 text-2xl font-semibold mt-6'>Recent offers</h2>
            <Link 
              to={'/offers'}
              className='block px-3 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out'  
            >
              Show more offers
            </Link>
            <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
              {offerListings.map(({id, data}) => (
                <ListingItem
                  key={id}
                  id={id}
                  listing={data}
                />
              ))}
            </ul>
          </section>
        )}
        {/* Places for rent */}
        {rentListings && rentListings.length > 0 && (
          <section className=''>
            <h2 className='px-3 text-2xl font-semibold mt-6'>Places for rent</h2>
            <Link 
              to={'/category/rent'}
              className='block px-3 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out'  
            >
              Show more places for rent
            </Link>
            <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
              {rentListings.map(({id, data}) => (
                <ListingItem
                  key={id}
                  id={id}
                  listing={data}
                />
              ))}
            </ul>
          </section>
        )}
        {/* Places for sale */}
        {saleListings && saleListings.length > 0 && (
          <section className=''>
            <h2 className='px-3 text-2xl font-semibold mt-6'>Places for sale</h2>
            <Link 
              to={'/category/sell'}
              className='block px-3 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out'  
            >
              Show more places for sale
            </Link>
            <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
              {saleListings.map(({id, data}) => (
                <ListingItem
                  key={id}
                  id={id}
                  listing={data}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
