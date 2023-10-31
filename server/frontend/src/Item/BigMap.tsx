import { useEffect } from 'react';

const BigMap = () => {
  // const locations = [
  //   { lat: 20.980973680638193, lng: 105.78458942608265 }, // Thay thế bằng tọa độ của điểm đánh dấu
  //   // Thêm các điểm đánh dấu khác tại đây
  // ];

  // useEffect(() => {
  //   function initialize() {
  //     const mapOptions = {
  //       center: { lat: 20.980973680638193, lng: 105.78458942608265 }, // Thay thế bằng tọa độ mặc định
  //       zoom: 16, // Thay đổi cấp độ phóng to/kéo nhỏ theo ý muốn
  //       gestureHandling: 'none', // Tắt chức năng kéo thả
  //       disableDefaultUI: true, // Tắt giao diện mặc định của bản đồ
  //     };

  //     const map = new (window as any).google.maps.Map(
  //       document.getElementById('map'),
  //       mapOptions
  //     );

  //     locations.forEach((location, index) => {
  //       new (window as any).google.maps.Marker({
  //         position: location,
  //         map: map,
  //         title: `Marker ${index + 1}`,
  //       });
  //     });
  //   }

  //   if (!(window as any).google) {
  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap`;
  //     script.defer = true;
  //     script.async = true;
  //     script.onload = initialize;
  //     document.head.appendChild(script);
  //   } else {
  //     initialize();
  //   }
  // }, [locations]);

  
  return <div id='map' style={{ width: '100%', height: '450px' }} />;
};

export default BigMap;
