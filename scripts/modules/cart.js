import { getElement, getElements } from "./domUtils.js";
import { setLocalStorage, getFromLocalStorage, removeFromLocalStorage, getUserData, setUserData } from "./localStorageUtils.js";
import { fetchMenu } from "./api.js";
import { generateConfirmationNumber } from "./utils.js";

export async function addToCartListener() {
  console.log("addToCartListener()");

  const menu = await fetchMenu();

  setTimeout(() => {
    const menuButtons = getElements(".list-item__quantity-button");

    menuButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log("Klick på:", event.target.closest(".list-item"));

        const productElement = event.target.closest(".list-item");
        const productId = Number(productElement.dataset.id); // Konvertera till nummer

        // Hämta rätt produkt från menyn
        const product = menu.find((item) => item.id === productId);
        console.log(product);

        if (product) {
          addProductToCart(product); // Lägg till i localStorage
          updateCartAlert(); // Uppdatera siffran i varukorgen
        } else {
          console.error("Kunde inte hitta rätten med ID:", productId);
        }
      });
    });
  }, 500);
}

function addProductToCart(product) {
  let userData = getUserData();
  let cart = userData.cart;

  let existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  userData.cart = cart;
  setUserData(userData);
}

export function updateCartAlert() {
  const cartIcon = getElement("#cartAlert");
  const userData = getUserData();
  let totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartIcon.textContent = totalItems;
}

//Om man vill läsa in senaste ordern från local Storage
export function latestOrder() {
  const userData = getUserData();
  const orders = userData.orderHistory;

  if (orders.length === 0) return;

  const latestOrder = orders[orders.length - 1];
  const orderId = getElement("#orderId");
  orderId.textContent = `#${latestOrder.id}`;
  console.log(latestOrder.id);
}

export function orderCart() {
  const cart = getFromLocalStorage("cart");
  const confirmationNumber = generateConfirmationNumber();

  const orders = {
    ConfirmationNumber: confirmationNumber,
    startTime: Date.now(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
    timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
  };

  adminOrderHistory(confirmationNumber, orders.items, orders.total, orders.timestamp);

  removeFromLocalStorage("cart");

  return orders;
}

// Försök till att rädda Robins funktion till adminpage...
// funktion för att spara en egen local storage till admin innehållande confirmationnumber, varor, totala summan och klockslag.
export function adminOrderHistory(number, items, total, timestamp) {
  const orderHistory = getFromLocalStorage(`orderhistory`);

  const newOrder = {
    number,
    items,
    total,
    timestamp,
  };

  orderHistory.push(newOrder);

  setLocalStorage(`orderhistory`, orderHistory);
  console.log("Order sparad för admin:", newOrder);
}
