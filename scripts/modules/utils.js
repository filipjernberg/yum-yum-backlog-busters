import { getElement, addClasses, styleElement, removeClasses } from "./domUtils.js";
import { getFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";
import { registerUser } from "./eventHandlers.js";

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

  startTimer(`#timerConfirmation`);
  addClasses(confirmationSection, [`flex`]);
  addClasses(orderWrapperRef, [`d-none`]);
  removeClasses(orderWrapperRef, ["flex"]);
  styleElement(body, `backgroundColor`, `#605858`);
  saveUserData(`#timerConfirmation`);
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
}

function handleRegistrationForm() {
  const registrationWrapperRef = getElement(`#wrapperRegister`);
  const wrapperguestRef = getElement(`#wrapperGuest`);

  removeClasses(registrationWrapperRef, [`d-none`]);
  addClasses(registrationWrapperRef, [`flex`]);

  addClasses(wrapperguestRef, [`d-none`]);
  removeClasses(wrapperguestRef, [`flex`]);
}

export function startTimer(timerElementId) {
  const startTime = Date.now();
  // setLocalStorage(`startTime`, startTime);
  getConfirmationNumber(startTime);
  startCountdown(startTime, timerElementId);
}

export function startCountdown(startTime, timerElementId) {
  const countdownElement = getElement(timerElementId);

  const duration = 10 * 60 * 1000;

  const timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const timeLeft = duration - elapsedTime;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      countdownElement.textContent = `Maten är klar`;
      return;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
  }, 1000);
}

export function getConfirmationNumber(number) {
  getElement(`#confirmationNumber`).textContent = `#${number}`;
}

export function generateConfirmationNumber() {
  return Math.floor(Math.random() * 1000000);
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

// export function extraSaveUserData(username, email, password) {
//   const user = {
//     username: username,
//     email: email,
//     password: password,
//     orders: [],
//   };
//   let users = getFromLocalStorage(`users`);
//   console.log(username);

//   users[username] = user;

//   setLocalStorage(`users`, users);
//   console.log(`saved håkan?`);
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
