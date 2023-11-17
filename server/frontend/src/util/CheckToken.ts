import {
  getExpiresTimeFromStorage,
  removeUserFromStorage,
  saveUserToStorage,
} from "./LocalStorage";

import swal from "sweetalert";

export const checkAccessTokenExpiration = async () => {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeOut = getExpiresTimeFromStorage();

  const showExpirationWarning = async () => {
    const willDelete = await swal({
      title: "Session expires!",
      text: "please login again!",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      removeUserFromStorage();
      window.location.href = "/login";
    }
  };

  if (timeOut != null) {
    console.log(parseInt(timeOut, 10) / 1000 - currentTime);
    setTimeout(
      showExpirationWarning,
      (parseInt(timeOut, 10) / 1000 - currentTime) * 1000
    );
  }
};

export const setAccessTokenWithExpiration = (accessToken: any) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = (currentTime + accessToken.data.exp_time) * 1000;
  saveUserToStorage(accessToken.data.role, expirationTime.toString());
};
