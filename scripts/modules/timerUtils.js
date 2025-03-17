import { getConfirmationNumber } from "./utils.js";
import { getElement } from "./domUtils.js";

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
