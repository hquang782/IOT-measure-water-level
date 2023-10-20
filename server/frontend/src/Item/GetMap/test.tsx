import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
}
interface MapProps {
  location: DeviceData[];
}

const containerStyle = {
  width: "100%",
  height: "400px",
};


function MyComponent({ location }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
  });
  const center = { lat:location.length > 0 ? location[0].lat : 20.98049466365608,lng: location.length > 0 ? location[0].lng :105.78807860699418};
  
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);


  const image = {
    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
  };

  return isLoaded ? (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {location.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={image}
            shape={{
              coords: [1, 1, 1, 20, 18, 20, 18, 1],
              type: "poly",
            }}
            title={marker.name+": "+marker.high}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
