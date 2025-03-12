import { getElement } from "./domUtils.js";

// Beställ knapp på mfood-menu.html
export function setupOrderButton() {
  console.log(`hej`);

  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    console.log(`Klick på beställning`);
    window.location.href = "../pages/receipts.html?showConfirmation=true";
  });
}

export function setupSingleReceipt() {
  console.log(`singlereceipt function`);

  const singleReceiptBtn = getElement(`#seeReceipt`);
  console.log(singleReceiptBtn);

  singleReceiptBtn.addEventListener(`click`, function () {
    console.log(`Klick på visa kvitto`);

    window.location.href = "../pages/receipts.html?showSingleReceipt=true";
  });
}

// export function setupNewOrderButton() {
//   console.log(`new order please`);
//   const newOrderBtn = getElement(`#newOrder`);
//   newOrderBtn.addEventListener(`click`, function () {
//     console.log(`Klickade på gör ny beställning`);
//     window.location.href = "../pages/food-menu.html";
//   });
// }
