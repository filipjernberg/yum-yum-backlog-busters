import { writeConfirmationNumber } from "./utils.js";
import { getElement } from "./domUtils.js";

// export function startTimer(start) {
//   // const startTime = Date.now();
//   // setLocalStorage(`startTime`, startTime);
//   writeConfirmationNumber(start);
// }

export function startCountdown(startTime, timerElementId) {
  const countdownElement = getElement(timerElementId);
  writeConfirmationNumber(startTime);

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
