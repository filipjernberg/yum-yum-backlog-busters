import { getElements, getElement, addClasses } from "./domUtils.js";
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
    body.style.backgroundColor = `#605858`;
    // Ovan är bara test. behöver komma åt variabelnamn från css
    // DOM funktion för att ändra style?
  }
  if (params.get(`showSingleReceipt`) === `true`) {
    addClasses(receiptwrapperRef, [`flex`]);
    addClasses(orderWrapperRef, [`d-none`]);
    body.style.backgroundColor = `#605858`;

    const startTime = getFromLocalStorage(`startTime`);
    if (startTime) {
      startCountdown(startTime, `#timerForReceipt`);
    }
  }
}

export function startTimer(timerElementId) {
  const startTime = Date.now();
  setLocalStorage(`startTime`, startTime);

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

// export function startTimer(duration = 10 * 60) {
//   console.log(`timer startad`);

//   const id = `#${Date.now()}`;
//   const countdownRefs = getElements(`.countdown`);

//   let activeTimers = getFromLocalStorage(`activeTimers`);
//   activeTimers.push({ id, timeLeft: duration });
//   setLocalStorage(`activeTimers`, activeTimers);

//   getConfirmationNumber(id);

//   startCountdown(duration, id);
// }

// //Startar nedräkningen
// export function startCountdown(duration, id) {
//   let timeLeft = duration;
//   const timers = {};

//   timers[id] = setInterval(() => {
//     timeLeft--;

//     updateTimeLeftInStorage(id, timeLeft);

//     if (timeLeft >= 0) {
//       updateCountdown(timeLeft);
//     }
//     if (timeLeft === 0) {
//       clearInterval(timers[id]);
//       delete timers[id];
//       finishCountdown(id);
//     }
//   }, 1000);
// }

// export function updateCountdown(timeLeft) {
//   const countdownRefs = getElements(".countdown"); // Hämta alla element där timern ska visas
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;
//   countdownRefs.forEach((count) => {
//     count.textContent = `Klar om ${minutes}m ${seconds}s`;
//   });
// }

// export function finishCountdown(id) {
//   const countdownRefs = getElements(".countdown");

//   countdownRefs.forEach((count) => {
//     count.textContent = `Maten är redo!`;
//   });
//   removeFromLocalStorage("activeTimers", id);
// }

// export function checkForActiveTimer() {
//   const activeTimers = getFromLocalStorage(`activeTimers`);

//   if (activeTimers.length > 0) {
//     const id = activeTimers[activeTimers.length - 1].id;
//     displayTimer(id);
//   } else {
//     console.log("Inga aktiva timers finns.");
//   }
// }

// export function displayTimer(id) {
//   const timeLeft = getTimer(id);

//   if (timeLeft !== null) {
//     if (timeLeft > 0) {
//       updateCountdown(timeLeft);
//     } else {
//       finishCountdown(id);
//     }
//   } else {
//     console.log(`Timer med id: ${id} finns inte i localeStorage`);
//   }
// }

export function getConfirmationNumber(number) {
  getElement(`#confirmationNumber`).textContent = number;
}

// export function getTimer(id) {
//   const activeTimers = getFromLocalStorage(`activeTimers`);
//   const timer = activeTimers.find((timer) => timer.id === id);
//   return timer ? timer.timeLeft : null;
// }

// export function updateTimeLeftInStorage(id, timeLeft) {
//   let activeTimers = getFromLocalStorage(`activeTimers`);

//   console.log("Aktiva timers före uppdatering:", activeTimers);

//   const timerIndex = activeTimers.findIndex((timer) => timer.id === id);
//   if (timerIndex !== -1) {
//     activeTimers[timerIndex].timeLeft = timeLeft;
//     console.log("Aktiva timers efter uppdatering:", activeTimers);
//     setLocalStorage(`activeTimers`, activeTimers);
//   }
// }
