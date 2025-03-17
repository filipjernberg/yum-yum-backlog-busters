import { getElement, addClasses, styleElement, removeClasses } from "./domUtils.js";
import { getFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";
import { registerUser } from "./eventHandlers.js";
import { fetchUsers } from "./api.js";
import { startCountdown } from "./timer.js";
import { handleRegistrationForm } from "./formUtils.js";
import { orderCart } from "./cart.js";

export function getParams() {
  return new URLSearchParams(window.location.search);
}

export function checkParams(params) {
  const confirmationSectionRef = getElement(`#wrapperOrderConfirmation`);

  if (confirmationSectionRef) {
    removeClasses(confirmationSectionRef, ["flex"]);
  }

  if (params.get(`showConfirmation`) === `true`) {
    handleOrderConfirmation(confirmationSectionRef);
  }
  if (params.get(`showSingleReceipt`) === `true`) {
    handleSingleReceipt();
  }
  if (params.get(`registrationForm`) === `true`) {
    handleRegistrationForm();
    registerUser();
  }
}

export function handleOrderConfirmation(confirmationSection) {
  const orderWrapperRef = getElement(`#wrapperOrders`);
  const body = getElement(`body`);

  addClasses(confirmationSection, [`flex`]);
  addClasses(orderWrapperRef, [`d-none`]);
  removeClasses(orderWrapperRef, ["flex"]);
  styleElement(body, `backgroundColor`, `#605858`);

  saveOrder(`#timerConfirmation`);
}

function handleSingleReceipt() {
  const receiptWrapperRef = getElement(`#wrapperSingleReceipt`);
  const orderWrapperRef = getElement(`#wrapperOrders`);
  const body = getElement(`body`);

  addClasses(receiptWrapperRef, [`flex`]);
  addClasses(orderWrapperRef, [`d-none`]);
  removeClasses(orderWrapperRef, ["flex"]);
  styleElement(body, `backgroundColor`, `#605858`);

  const users = getFromLocalStorage(`users`);
  if (users.length > 0) {
    const latestUser = users[users.length - 1]; // Hämta senaste beställningen
    if (latestUser.orders.startTime) {
      startCountdown(latestUser.orders.startTime, `#timerForReceipt`);
    }
  }
}

//genererar ett random nummer som vi sedan anger till confirmationnumber
export function generateConfirmationNumber() {
  return Math.floor(Math.random() * 1000000);
}

//Skriver ut vårt nummer i rutan för confirmationnnumber
export function writeConfirmationNumber(number) {
  getElement(`#confirmationNumber`).textContent = `#${number}`;
}

// sparar en timer och confirmationNumber kopplat till vår senaste skapade användare
export function saveOrder(timerElementId) {
  // const confirmationNumber = generateConfirmationNumber();
  // const startTime = Date.now();

  let users = getFromLocalStorage(`users`);
  if (users.length === 0) {
    console.log(`Ingen användare hittad. Kan inte spara orderdata`);
    return;
  }
  const orders = orderCart();

  //Ändra detta senare till att gälla inloggad person istället
  users[users.length - 1] = {
    ...users[users.length - 1], // Behåll tidigare data
    // confirmationNumber,
    // startTime,
    orders,
  };

  setLocalStorage(`users`, users);
  console.log(`Orderdata sparad för användare:`, users[users.length - 1]);

  startCountdown(orders.startTime, timerElementId);
}

// Krånglig kod, avvaktar med den
// export function saveOrder(timerElementId) {
//   // const confirmationNumber = generateConfirmationNumber();
//   // const startTime = Date.now();

//   const users = getFromLocalStorage(`users`);
//   const currentUser = getFromLocalStorage(`currentUser`);
//   const guest = getFromLocalStorage(`guestUser`);

//   if (!currentUser && !guest) {
//     console.log(`Ingen användare inloggad. Kan inte spara order.`);
//     return;
//   }

//   const orders = orderCart();

//   if (currentUser) {
//     const user = users.find((u) => u.username === currentUser);
//     if (user) {
//       if (user.orders && Array.isArray(user.orders)) {
//         user.orders.push(orders); // Lägg till den nya ordern i arrayen
//       } else {
//         user.orders = [orders];
//       }
//     } else {
//       console.log(`Användare ej hittad. Kan ej uppdatera ordern.`);
//     }
//   } else if (guest) {
//     if (guest.orders && Array.isArray(guest.orders)) {
//       guest.orders.push(orders); // Lägg till den nya ordern i arrayen
//     } else {
//       guest.orders = [orders]; // Om ingen tidigare order finns, skapa en ny array
//     }
//     setLocalStorage(`guestUser`, guest);
//   }
//   // //Ändra detta senare till att gälla inloggad person istället
//   // users[users.length - 1] = {
//   //   ...users[users.length - 1], // Behåll tidigare data
//   //   // confirmationNumber,
//   //   // startTime,
//   //   orders,
//   // };

//   setLocalStorage(`users`, users);
//   console.log(`Orderdata sparad för användare`);

//   startCountdown(orders.startTime, timerElementId);
// }

export function getUserData() {
  const userData = getFromLocalStorage(`user`);

  if (userData && userData.length > 0) {
    console.log("UserData retrieved:", userData);
    const latestUser = userData[userData.length - 1];
    if (latestUser.startTime) {
      startCountdown(latestUser.startTime, `#timerForReceipt`);
    }
  } else {
    console.log("No user data found");
  }
}

export async function getAllUsers() {
  try {
    const usersFromAPI = await fetchUsers();
    const usersFromLocalStorage = getFromLocalStorage(`users`);

    console.log("Users from API:", usersFromAPI);
    console.log("Users from Local Storage:", usersFromLocalStorage);

    // Se till att vi alltid har arrayer
    return [...(Array.isArray(usersFromAPI) ? usersFromAPI : []), ...(Array.isArray(usersFromLocalStorage) ? usersFromLocalStorage : [])];
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    return [];
  }
}

// sparar ny användare, anropas när valideringen av formuläret för registrering lyckats. Användare sparas under "users"
// Hashedpassword är krypterade tecken
export function saveNewUser(username, email, hashedPassword) {
  const usersFromLocalStorage = getFromLocalStorage(`users`);
  const newUser = { username, email, password: hashedPassword };

  usersFromLocalStorage.push(newUser);
  setLocalStorage(`users`, usersFromLocalStorage);
  console.log(`ny användare sparad`);
}

//funktion för att ändra lösenordet till krypterad när det sparas i localstorage. Behövs liknande för att kunna jämföra i login senare
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Omvandla hashBuffer till en array
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return hashHex; // Returvärdet är den hexa-hashade versionen av lösenordet
}

// Senare funktion för att jämföra lösenord?
// async function comparePasswords(inputPassword, storedHash) {
//   const inputHash = await hashPassword(inputPassword);
//   return inputHash === storedHash;
// }
