import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { MdLocationOn, MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

export default function ListingItem({id, listing, onDelete, onEdit}) {
  return (
    <li className='relative overflow-hidden bg-white shadow-md hover:shadow-xl rounded-md transition-shadow duration-150 ease-in mx-auto sm:mx-3 my-6 sm:my-3 max-w-sm'>
      <Link to={`/category/${listing.type}/${id}`}>
        <img 
          src={listing.imgUrls[0]}
          alt={listing.name}
          loading='lazy'
          className='h-[170px] w-full object-cover hover:scale-105 transition-transform duration-200 ease-in'
        />
        <Moment 
          fromNow
          className='absolute top-2 left-2 bg-blue-500 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-3'>
          <p className='flex items-center space-x-1 mb-1'>
            <MdLocationOn className='text-lg text-green-600' />
            <span className='text-gray-600 truncate font-semibold text-sm'>
              {listing.address}
            </span>
          </p>
          <h4 className='font-semibold m-0 text-xl truncate'>
            {listing.name}
          </h4>
          <p className='mt-2 font-semibold text-blue-500'>
            $
            {
              listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            {listing.type === 'rent' && <span>{' '} / month</span>}
          </p>
          <div className='flex items-center space-x-3 mt-3 font-bold text-xs'>
            <span>
              {
                listing.bedrooms > 1 
                  ? `${listing.bedrooms} Beds` 
                  : `${listing.bedrooms} Bed`
              }
            </span>
            <span>
              {
                listing.bathrooms > 1 
                  ? `${listing.bathrooms} Baths` 
                  : `${listing.bathrooms} Bath`
              }
            </span>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash 
        className='absolute bottom-2 right-2 text-lg cursor-pointer hover:bg-gray-100 text-red-500 p-px rounded-sm  transition-all ease-in-out duration-150 shadow-sm hover:shadow' 
          onClick={() => onDelete(id)}  
        />
      )}
      {onEdit && (
        <MdEdit 
          className='absolute bottom-2 right-7 text-lg cursor-pointer hover:bg-gray-100 text-green-500 p-px rounded-sm  transition-all ease-in-out duration-150 shadow-sm hover:shadow' 
          onClick={() => onEdit(id)}  
        />
      )}
    </li>
  )
}
