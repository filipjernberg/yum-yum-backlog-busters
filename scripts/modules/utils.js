import { getElements } from "./domUtils.js";

export function timer() {
  console.log(`hej`);

  const duration = 10 * 60; //10 minuter
  const id = `timer-${Date.now()}`;

  const countdownRefs = getElements(`.countdown`);

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
    }
  );
}

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
