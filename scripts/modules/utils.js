import { getElements, getElement, addClasses } from "./domUtils.js";
import { getFromLocalStorage, removeFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";

export function startTimer(duration = 10 * 60) {
  console.log(`timer startad`);

  const id = `#${Date.now()}`;
  const countdownRefs = getElements(`.countdown`);

  let activeTimers = getFromLocalStorage(`activeTimers`);
  activeTimers.push({ id, timeLeft: duration });
  setLocalStorage(`activeTimers`, activeTimers);

  getConfirmationNumber(id);

  startCountdown(
    duration,
    id,
    (timeLeft) => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      countdownRefs.forEach((count) => (count.textContent = `Klar om ${minutes}m ${seconds}s`));
    },
    () => {
      countdownRefs.forEach((count) => (count.textContent = `Maten är redo!`));
      removeFromLocalStorage(`activeTimers`, id);
    }
  );
}

//Startar nedräkningen
export function startCountdown(duration, id, updateCallback, finishCallback) {
  let timeLeft = duration;
  const timers = {};

  timers[id] = setInterval(() => {
    timeLeft--;

    if (timeLeft >= 0) {
      updateCallback(timeLeft);
    }
    if (timeLeft === 0) {
      clearInterval(timers[id]);
      delete timers[id];
      finishCallback();
    }
  }, 1000);
}

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
    startTimer();
    confirmationSectionref.style.display = `flex`;
    addClasses(orderWrapperRef, [`d-none`]);
    body.style.backgroundColor = `#605858`;
    // Ovan är bara test. behöver komma åt variabelnamn från css
    // DOM funktion för att ändra style?
  }
  if (params.get(`showSingleReceipt`) === `true`) {
    addClasses(receiptwrapperRef, [`flex`]);
    addClasses(orderWrapperRef, [`d-none`]);
    body.style.backgroundColor = `#605858`;
  }
}

export function getConfirmationNumber(number) {
  getElement(`#confirmationNumber`).textContent = number;
}
