import { getElements, getElement, addClasses, styleElement } from "./domUtils.js";
import { getFromLocalStorage, removeFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";

export function getParams() {
  return new URLSearchParams(window.location.search);
}

export function checkParams(params) {
  const confirmationSectionref = getElement(`#wrapperOrderConfirmation`);
  const orderWrapperRef = getElement(`#wrapperOrders`);
  const receiptwrapperRef = getElement(`#wrapperSingleReceipt`);
  const body = getElement(`body`);

  if (confirmationSectionref) {
    confirmationSectionref.style.display = `none`;
  }

  if (params.get(`showConfirmation`) === `true`) {
    startTimer(`#timerConfirmation`);
    confirmationSectionref.style.display = `flex`;
    addClasses(orderWrapperRef, [`d-none`]);
    styleElement(body, `backgroundColor`, `#605858`);

    // Ovan är bara test. behöver komma åt variabelnamn från css
    // DOM funktion för att ändra style?
  }
  if (params.get(`showSingleReceipt`) === `true`) {
    addClasses(receiptwrapperRef, [`flex`]);
    addClasses(orderWrapperRef, [`d-none`]);
    styleElement(body, `backgroundColor`, `#605858`);

    const startTime = getFromLocalStorage(`startTime`);
    if (startTime) {
      startCountdown(startTime, `#timerForReceipt`);
    }
  }
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
