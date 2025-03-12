import { getElement } from "./domUtils.js";
import { timer } from "./utils.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  console.log(`hej`);

  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    console.log(`Klick på beställning`);
    timer();
    window.location.href = "../pages/receipts.html?showConfirmation=true";
  });
}

//Visa enskilt kvitto
export function setupSingleReceipt() {
  console.log(`singlereceipt function`);

  const singleReceiptBtn = getElement(`#seeReceipt`);
  console.log(singleReceiptBtn);

  singleReceiptBtn.addEventListener(`click`, function () {
    console.log(`Klick på visa kvitto`);

    window.location.href = "../pages/receipts.html?showSingleReceipt=true";
  });
}
