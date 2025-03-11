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

export function clearLocalStorage() {
    localStorage.clear();
}
