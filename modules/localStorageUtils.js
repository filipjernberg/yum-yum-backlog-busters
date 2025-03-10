function setLocalStorage(keyname, obj) {
  localStorage.setItem(keyname, JSON.stringify(obj));
}

function getFromLocalStorage(keyname) {
  return JSON.parse(localStorage.getItem(keyname)) || [];
}

function addToLocalStorage(keyname, obj) {
  let list = getFromLocalStorage(keyname);
  list.push(obj);
  setLocalStorage(keyname, list);
}

function removeFromLocalStorage(keyname) {
  localStorage.removeItem(keyname);
}

function clearLocalStorage() {
  localStorage.clear();
}

export { setLocalStorage, getFromLocalStorage, addToLocalStorage, removeFromLocalStorage, clearLocalStorage };
