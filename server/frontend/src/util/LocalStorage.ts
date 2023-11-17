export function saveUserToStorage(accessValue: string, expTime: string) {
  localStorage.setItem("user", accessValue);
  localStorage.setItem("userExpirationTime", expTime);
}

export function removeUserFromStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("userExpirationTime");
}

export function getUserFromStorage() {
  return localStorage.getItem("user");
}

export function getExpiresTimeFromStorage() {
  return localStorage.getItem("userExpirationTime");
}
