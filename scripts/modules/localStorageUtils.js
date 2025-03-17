export function setLocalStorage(keyname, obj) {
  localStorage.setItem(keyname, JSON.stringify(obj));
}

export function getFromLocalStorage(keyname) {
  return JSON.parse(localStorage.getItem(keyname)) || [];
}

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
