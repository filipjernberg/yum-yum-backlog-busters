import { getElement } from "./domUtils.js";

export function setupOrderButton() {
  console.log(`hej`);

  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    console.log(`Klick på beställning`);
    window.location.href = "../pages/receipts.html?showConfirmation=true";
  });
}
