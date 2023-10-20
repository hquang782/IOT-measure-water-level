import React, { useEffect, useState } from "react";
import "../../style/style.css";

interface DeviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}
interface MapProps {
  devicedata: DeviceData[];
}

const MapComponent: React.FC<MapProps> = ({ devicedata }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly`;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);

    // Hàm callback để kiểm tra việc tải xong bản đồ
    // script.onload = () => {
    //   setMapLoaded(true);
    // };

    // Clean up để tránh memory leak
    // return () => {
    //   script.onload = null;
    // };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      initMap();
    }
  }, [mapLoaded]);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: { lat: 20.980757106592176, lng: 105.78855731433865 },
    });

    setMarkers(map);
  };

  const setMarkers = (map: any) => {
    const image = {
      url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      size: new window.google.maps.Size(20, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(0, 32),
    };

    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };

    for (let i = 0; i < devicedata.length; i++) {
      const beach = devicedata[i];
      console.log(beach);
      new window.google.maps.Marker({
        position: { lat: beach.lat, lng: beach.lng },
        map,
        icon: image,
        shape: shape,
        title: beach.name + ": " + beach.high,
      });
    }
  };

  return (
    <div className="map-container">
      <div style={{ height: "400px" }} id="map"></div>
    </div>
  );
};

export default MapComponent;
