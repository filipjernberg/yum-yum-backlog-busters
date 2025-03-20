import { writeConfirmationNumber } from "./utils.js";
import { getElement } from "./domUtils.js";
import { setUserData } from "./localStorageUtils.js";
import { getUsers } from "./users.js";

// export function startTimer(start) {
//   // const startTime = Date.now();
//   // setLocalStorage(`startTime`, startTime);
//   writeConfirmationNumber(start);
// }

// export function startCountdown(startTime, timerElementId) {
//   const countdownElement = getElement(timerElementId);
//   writeConfirmationNumber(startTime);

//   const duration = 10 * 60 * 1000;

//   const timerInterval = setInterval(() => {
//     const elapsedTime = Date.now() - startTime;
//     const timeLeft = duration - elapsedTime;

//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       countdownElement.textContent = `Maten är klar`;
//       return;
//     }

//     const minutes = Math.floor(timeLeft / 60000);
//     const seconds = Math.floor((timeLeft % 60000) / 1000);
//     countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
//   }, 1000);
// }

export function startCountdown(startTime, orderId = null) {
  const container1 = document.querySelector("#timerConfirmation");
  // const container2 = document.querySelector("#timerForReceipt");

  // Sätt countdownElement till den första containern som finns
  let countdownElement = container1 || container2;

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
      // Move order from pending to orderHistory if orderId provided
      if (orderId !== null) {
        let userData = getUsers();
        if (!userData || !userData.currentUser) {
          console.error("Ingen användardata hittades.");
          return;
        }

        let currentUser = userData.currentUser;
        if (!currentUser.pending) currentUser.pending = [];
        if (!currentUser.orderHistory) currentUser.orderHistory = [];

        const orderIndex = currentUser.pending.findIndex((order) => order.id === orderId);
        if (orderIndex !== -1) {
          const completedOrder = currentUser.pending.splice(orderIndex, 1)[0];
          currentUser.orderHistory.push(completedOrder);
          saveUsers(userData);
          // setUserData(userData);
          console.log(`Order ${orderId} flyttades till orderhistorik.`);
        } else {
          console.warn(`Order ${orderId} hittades inte i pending.`);
        }
      }

      return;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
  }, 1000);
}

// import { writeConfirmationNumber } from "./utils.js";
// import { getElement } from "./domUtils.js";
// import { getUserData, setUserData } from "./localStorageUtils.js";

// // export function startTimer(start) {
// //   // const startTime = Date.now();
// //   // setLocalStorage(`startTime`, startTime);
// //   writeConfirmationNumber(start);
// // }

// // export function startCountdown(startTime, timerElementId) {
// //   const countdownElement = getElement(timerElementId);
// //   writeConfirmationNumber(startTime);
// //
// //   const duration = 10 * 60 * 1000;

// //   const timerInterval = setInterval(() => {
// //     const elapsedTime = Date.now() - startTime;
// //     const timeLeft = duration - elapsedTime;

// //     if (timeLeft <= 0) {
// //       clearInterval(timerInterval);
// //       countdownElement.textContent = `Maten är klar`;
// //       return;
// //     }

// //     const minutes = Math.floor(timeLeft / 60000);
// //     const seconds = Math.floor((timeLeft % 60000) / 1000);
// //     countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
// //   }, 1000);
// // }

// export function startCountdown(startTime, timerElementId, orderId = null) {
//   const countdownElement = getElement(timerElementId);
//   console.log(`timer`);

//   writeConfirmationNumber(startTime);
//   const duration = 10 * 60 * 1000;

//   const timerInterval = setInterval(() => {
//     const elapsedTime = Date.now() - startTime;
//     const timeLeft = duration - elapsedTime;

//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       countdownElement.textContent = `Maten är klar`;

//       // Move order from pending to orderHistory if orderId provided
//       if (orderId !== null) {
//         let userData = getUserData();
//         const orderIndex = userData.pending.findIndex((order) => order.id === orderId);

//         if (orderIndex !== -1) {
//           const completedOrder = userData.pending.splice(orderIndex, 1)[0];
//           userData.orderHistory.push(completedOrder);
//           setUserData(userData);
//           console.log(`Order #${orderId} moved to history.`);
//         }
//       }

//       return;
//     }

//     const minutes = Math.floor(timeLeft / 60000);
//     const seconds = Math.floor((timeLeft % 60000) / 1000);
//     countdownElement.textContent = `Klar om ${minutes}m ${seconds}s`;
//   }, 1000);
// }
