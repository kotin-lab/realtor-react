import React, { useEffect, useState } from 'react';
import { db } from 'firebase.config';
import { 
  collection, 
  getDocs, 
  limit, 
  orderBy, 
  query, 
  startAfter, 
  where 
} from 'firebase/firestore';
import { toast } from 'react-toastify';

// Components
import Spinner from 'components/Spinner';
import ListingItem from 'components/ListingItem';
import { useParams } from 'react-router';

export default function Category() {
  const { categoryName } = useParams();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const queryLimit = 4;

  /** Hooks */
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef, 
          where('type', '==', categoryName), 
          orderBy('timestamp', 'desc'),
          limit(queryLimit)
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
        
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error('Could not fetch listings');
      }
    }
    fetchListings();
  }, [categoryName]);

  // Handlers
  async function handleFetchMoreListings() {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef, 
        where('type', '==', categoryName), 
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(queryLimit)
      );
      const querySnap = await getDocs(q);

      const listings = [];
      querySnap.forEach(doc => {
        listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setListings(prevState => ([
        ...prevState,
        ...listings
      ]));
      setLoading(false);
      
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Could not fetch listings');
    }
  }

  return (
    <section className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center font-bold mt-6 mb-4'>
        {categoryName === 'rent'? 'Places for Rent': 'Places for Sale'}
      </h1>
      {loading
        ? <Spinner />
        : listings && listings.length > 0 
        ? (
          <>
            <main>
              <ul className='sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {listings.map(({id, data}) => (
                  <ListingItem key={id} id={id} listing={data} />
                ))}
              </ul>
            </main>
            {lastFetchedListing && (
              <div className='flex justify-center items-center'>
                <button 
                  onClick={handleFetchMoreListings}
                  className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 hover:border-slate-600 rounded transition duration-150 ease-in-out my-6'
                >
                    Load more
                </button>
              </div>
            )}
          </>
        )
        : (
          <p>There are no places</p>
        )}
    </section>
  )
}