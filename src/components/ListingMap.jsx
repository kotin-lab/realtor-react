import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Leaflet styles
import 'leaflet/dist/leaflet.css';

// Marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ListingMap({listing}) {
  return (
    <>
      <MapContainer 
        center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}
        style={{width: '100%', height: 'auto'}}
        className='aspect-video md:aspect-[4/3]'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
          <Popup>
            {listing.address}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}
