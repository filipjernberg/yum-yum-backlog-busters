import { getElement } from "./domUtils.js";
import { getFromLocalStorage, setLocalStorage, removeFromLocalStorage, clearLocalStorage } from "./localStorageUtils.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    console.log(`Klick på beställning`);
    const cart = getFromLocalStorage("cart");

    const order = {
      id: Date.now(), // Unikt order-ID baserat på tid
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
      timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
    };

    const orders = getFromLocalStorage("orderHistory") || [];
    orders.push(order);
    setLocalStorage("orderHistory", orders);

    removeFromLocalStorage("cart");

    window.location.href = "../pages/receipts.html?showConfirmation=true";
  });
}

//Töm varukorgen knapp på food-menu.html
export function removeOrderButton() {
  const removeOrderBtn = getElement("#removeOrder");

  removeOrderBtn.addEventListener("click", () => {
    removeFromLocalStorage("cart");
    location.reload();
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
