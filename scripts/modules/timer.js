import { writeConfirmationNumber } from "./utils.js";
import { getElement } from "./domUtils.js";
import { getUsers, saveUsers } from "./users.js";

export function startCountdown(startTime, confirmationNumber = null) {
  let countdownElement = document.querySelector("#timerConfirmation");

  console.log(`timer`);
  console.log(startTime);

  if (getElement(`#timerconfirmation`));
  writeConfirmationNumber(startTime);
  const duration = 10 * 60 * 1000;

  const timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const timeLeft = duration - elapsedTime;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      countdownElement.textContent = `Maten är klar`;
      console.log(`hit?`);

      if (confirmationNumber !== null) {
        let userData = getUsers();
        if (!userData || !userData.currentUser) {
          console.error("Ingen användardata hittades.");
          return;
        }

        let currentUser = userData.currentUser;
        if (!currentUser.pending) currentUser.pending = [];
        if (!currentUser.orderHistory) currentUser.orderHistory = [];

        const orderIndex = currentUser.pending.findIndex((order) => order.ConfirmationNumber === confirmationNumber);
        console.log(`vad är orderindex:`, orderIndex);

        if (orderIndex !== -1) {
          const completedOrder = currentUser.pending.splice(orderIndex, 1)[0];
          currentUser.orderHistory.push(completedOrder);
          saveUsers(userData);
          console.log(`Order ${confirmationNumber} flyttades till orderhistorik.`);
        } else {
          console.warn(`Order ${confirmationNumber} hittades inte i pending.`);
        }
      }

      return;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
  }, 1000);
}
