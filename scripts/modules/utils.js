import { getElement, addClasses, styleElement } from "./domUtils.js";
import { getFromLocalStorage, removeFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";

export function getParams() {
  return new URLSearchParams(window.location.search);
}

export function checkParams(params) {
  const confirmationSectionRef = getElement(`#wrapperOrderConfirmation`);
  const orderWrapperRef = getElement(`#wrapperOrders`);
  const receiptwrapperRef = getElement(`#wrapperSingleReceipt`);
  const body = getElement(`body`);

  if (confirmationSectionRef) {
    confirmationSectionRef.style.display = `none`;
  }

  if (params.get(`showConfirmation`) === `true`) {
    handleOrderConfirmation(confirmationSectionRef, orderWrapperRef, body);
  }
  if (params.get(`showSingleReceipt`) === `true`) {
    handleSingleReceipt(receiptwrapperRef, orderWrapperRef, body);
  }
}

export function handleOrderConfirmation(confirmationSectionRef, orderWrapperRef, body) {
  startTimer(`#timerConfirmation`);
  confirmationSectionRef.style.display = `flex`;
  addClasses(orderWrapperRef, [`d-none`]);
  styleElement(body, `backgroundColor`, `#605858`);
  saveUserData(`#timerConfirmation`);
}
function handleSingleReceipt(receiptWrapperRef, orderWrapperRef, body) {
  addClasses(receiptWrapperRef, [`flex`]);
  addClasses(orderWrapperRef, [`d-none`]);
  styleElement(body, `backgroundColor`, `#605858`);

  const startTime = getFromLocalStorage(`startTime`);
  if (startTime) startCountdown(startTime, `#timerForReceipt`);
}

export function startTimer(timerElementId) {
  const startTime = Date.now();
  setLocalStorage(`startTime`, startTime);
  getConfirmationNumber(startTime);
  startCountdown(startTime, timerElementId);
}

export function startCountdown(startTime, timerElementId) {
  const countdownElement = getElement(timerElementId);
  // const startTime = getFromLocalStorage(`startTime`);
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

export function submitOrder(orderDetails) {
  const confirmationNumber = generateConfirmationNumber();
}

//---

export function saveUserData(timerElementId) {
  const confirmationNumber = generateConfirmationNumber();
  const startTime = Date.now(); // Tidsstämpel när användaren skapar beställningen

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

export function getUserData() {
  const userData = getFromLocalStorage(`user`);

  if (userData && userData.length > 0) {
    console.log("UserData retrieved:", userData);
    startCountdown(userData[userData.length - 1].startTime, timerElementId);
  } else {
    console.log("No user data found");
  }
}
