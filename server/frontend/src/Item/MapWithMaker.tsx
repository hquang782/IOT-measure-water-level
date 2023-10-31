import React from 'react';
interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
}
interface MapProps {
  location: DeviceData;
}
const MapWithMarker: React.FC<MapProps> = ({ location }) => {
  console.log(location)
  const YOUR_API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao';
  
  return (
    <div className='map-container'>
      <iframe
        title='Embedded map'
        src={`https://www.google.com/maps/embed/v1/view?key=${YOUR_API_KEY}&center=20.980757106592176,105.78855731433865&zoom=16`}
        width='100%'
        height='450'
        style={{ border: 0 }}
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
      <img
        src='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        alt='Map Marker'
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -100%)',
          width: '25px',
          height: '25px',
        }}
      />
    </div>
  );
};

export default MapWithMarker;
