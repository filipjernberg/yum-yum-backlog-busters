export function setLocalStorage(keyname, obj) {
  localStorage.setItem(keyname, JSON.stringify(obj));
}

export function getFromLocalStorage(keyname) {
  return JSON.parse(localStorage.getItem(keyname)) || [];
}

// export function getIntFromLocalStorage(id, defaultValue) {
//   const storedValue = localStorage.getItem(id);
//   const parsedValue = parseInt(storedValue, 10); // Base 10 för tydlighet

//   return isNaN(parsedValue) ? defaultValue : parsedValue;
// }

export function addToLocalStorage(keyname, obj) {
  let list = getFromLocalStorage(keyname);
  list.push(obj);
  setLocalStorage(keyname, list);
}

export function removeFromLocalStorage(keyname) {
  localStorage.removeItem(keyname);
}

export function removeItemFromStorage(key, id) {
  let items = getFromLocalStorage(key);
  items = items.filter((item) => item.id !== id);
  setLocalStorage(key, items);
}

export function clearLocalStorage() {
  localStorage.clear();
}
