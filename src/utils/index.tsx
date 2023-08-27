import { onAuthStateChanged } from "firebase/auth";

import { firebaseAuth } from "./firebase";

export const getUserFromLocalStorage = () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      // return user;
      // ...
    }
  });

  const currentUserUid = localStorage.getItem("user");

  if (currentUserUid) {
    const parsed = JSON.parse(currentUserUid);

    return parsed;
  }

  return null;
};
