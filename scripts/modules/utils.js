import { getElements } from "./domUtils";

export function timer() {
  const duration = 10 * 60; //10 minuter
  const id = `timer-${Date.now()}`;

  const countdownRefs = getElements(`.countdown`);

  startCountdown(
    duration,
    id,
    (timeLeft) => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      countdownRefs.forEach((count) => (count.textContent = `Tid : ${minutes}m ${seconds}s`));
    },
    () => {
      countdownRefs.forEach((count) => (count.textContent = `Maten är redo!`));
    }
  );
}

function startCountdown(duration, id, updateCallback, finishCallback) {}
