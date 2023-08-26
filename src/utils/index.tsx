export const getUserFromLocalStorage = () => {
  const currentUserUid = localStorage.getItem('user');

  if (currentUserUid) {
    const parsed = JSON.parse(currentUserUid);

    return parsed;
  }

  return null;
};
