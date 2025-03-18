import { getElement, addClasses, styleElement, removeClasses } from "./domUtils.js";
import { getFromLocalStorage, setLocalStorage, getUserData, setUserData } from "./localStorageUtils.js";
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

  const userData = getFromLocalStorage(`user`);
  if (userData && userData.length > 0) {
    const latestUser = userData[userData.length - 1]; // Hämta senaste beställningen
    if (latestUser.startTime) startCountdown(latestUser.startTime, `#timerForReceipt`);
  }

  // Annelies kod för localstorage
  const users = getFromLocalStorage(`users`);
  if (users.length > 0) {
    const latestUser = users[users.length - 1]; // Hämta senaste beställningen
    if (latestUser.orders.startTime) {
      startCountdown(latestUser.orders.startTime, `#timerForReceipt`);
    }
  }
}

// Togs bort för överflödig
// export function startTimer(timerElementId) {
//   const startTime = Date.now();
//   // setLocalStorage(`startTime`, startTime);
//   getConfirmationNumber(startTime);
//   startCountdown(startTime, timerElementId);
// }

//Annelie flyttade denna till timer.js. Justera där istället?
export function startCountdown(startTime, timerElementId, orderId = null) {
  const countdownElement = getElement(timerElementId);
  const duration = 10 * 60 * 1000;

  const timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const timeLeft = duration - elapsedTime;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      countdownElement.textContent = `Maten är klar`;

      // Move order from pending to orderHistory if orderId provided
      if (orderId !== null) {
        let userData = getUserData();
        const orderIndex = userData.pending.findIndex((order) => order.id === orderId);

        if (orderIndex !== -1) {
          const completedOrder = userData.pending.splice(orderIndex, 1)[0];
          userData.orderHistory.push(completedOrder);
          setUserData(userData);
          console.log(`Order #${orderId} moved to history.`);
        }
      }

      return;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
  }, 1000);
}

// export function getConfirmationNumber(number) {
//   getElement(`#confirmationNumber`).textContent = `#${number}`;
// }

export function generateConfirmationNumber() {
  return Math.floor(Math.random() * 1000000);
}

//Skriver ut vårt nummer i rutan för confirmationnnumber
export function writeConfirmationNumber(number) {
  getElement(`#confirmationNumber`).textContent = `#${number}`;
}

export function saveUserData(timerElementId) {
  const confirmationNumber = generateConfirmationNumber();
  const startTime = Date.now();

  const userData = {
    confirmationNumber: confirmationNumber,
    startTime: startTime,
  };
  let user = getFromLocalStorage(`user`);

  user = Array.isArray(user) ? user : user ? [user] : [];
  user.push(userData);

  setLocalStorage(`user`, user);

  console.log("UserData saved:", userData);
  startCountdown(startTime, timerElementId);
}

export function getCurrentUser() {
  return localStorage.getItem("username") || "guest";
}

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
