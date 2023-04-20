import React, { useState } from 'react'

export default function CreateListing() {
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 0,
    bathrooms: 0,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: true,
    regularPrice: 0,
    discountedPrice: 0
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
    discountedPrice
  } = formData;

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form className='space-y-6 mt-6'>
        {/** Sell / Rent */}
        <div>
          <label className='block text-lg font-semibold mb-2'>Sell / Rent</label>
          <div className='flex items-center'>
            <button 
              type='button' 
              name='type'
              value='sell'
              onClick={() => {}}
              className={`${type === 'sell'? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Sell
            </button>
            <button 
              type='button' 
              name='type'
              value='rent'
              onClick={() => {}}
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
            onChange={() => {}}
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
              onChange={() => {}}
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
              onChange={() => {}}
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
              value={parking}
              onClick={() => {}}
              className={`${parking? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Yes
            </button>
            <button 
              type='button' 
              name='parking'
              value={parking}
              onClick={() => {}}
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
              value={furnished}
              onClick={() => {}}
              className={`${furnished? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Yes
            </button>
            <button 
              type='button' 
              name='furnished'
              value={furnished}
              onClick={() => {}}
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
            onChange={() => {}}
            placeholder='Address'
            required
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition duration-200 ease-in-out'
          />
        </div>
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
            onChange={() => {}}
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
              value={offer}
              onClick={() => {}}
              className={`${offer? 'bg-slate-600 text-white': 'bg-white'} px-7 py-3 font-medium text-sm uppercase shadow-md rounded-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 w-full`}
            >
              Yes
            </button>
            <button 
              type='button' 
              name='offer'
              value={offer}
              onClick={() => {}}
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
              onChange={() => {}}
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
                onChange={() => {}}
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
            onChange={() => {}}
            accept='.jpg,.png,.jpeg'
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 focus:border-slate-600 rounded-md transition ease-in-out duration-200'
          />
        </div>
        {/** Submit button */}
        <button
          type='submit'
          className='w-full px-7 py-3 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-medium text-sm uppercase rounded-md shadow-md hover:shadow-lg focus:shadow-lg transition ease-in-out duration-200'
        >
          Create Listing
        </button>
      </form>
    </main>
  )
}
