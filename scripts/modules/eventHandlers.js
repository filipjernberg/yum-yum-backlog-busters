import { addClasses, getElement, getElements, removeClasses, toggleClasses } from "./domUtils.js";
import { fetchMenu } from "./api.js";

import { showCart, addProductToCart, updateCartAlert, updateCartAlertTest } from "./cart.js";
import {
  getFromLocalStorage,
  setLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage,
  getUserData,
  setUserData,
} from "./localStorageUtils.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  const addOrderBtn = getElement(`#addOrder`);
  addOrderBtn.addEventListener(`click`, () => {
    let userData = getUserData();

    const order = {
      id: Date.now(),
      items: userData.cart,
      total: userData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      timestamp: new Date().toISOString(),
      timeRemaining: 600, // Timer in seconds (e.g., 10 min)
    };

    userData.pending.push(order);
    userData.cart = [];

    setUserData(userData);
    window.location.href = "../pages/receipts.html?showConfirmation=true";
  });
}

//Töm varukorgen knapp på food-menu.html
export function removeOrderButton() {
  const removeOrderBtn = getElement("#removeOrder");

  removeOrderBtn.addEventListener("click", () => {
    let userData = getUserData();
    userData.cart = [];
    setUserData(userData);
    location.reload();
  });
}

export async function setupQuantityBtnListener(button) {
  button.addEventListener("click", async (event) => {
    const product = await getClickedElement(event);
    console.log(product);

    // console.log(button.classList.contains(`list-item__quantity-button`));

    if (button.classList.contains(`list-item__quantity-button`)) {
      console.log(`hej`);
      addProductToCart(product); // Lägg till i localStorage
    }
  });
}

export async function getClickedElement(event) {
  const productElement = event.target.closest(".list-item");
  console.log("Klick på:", productElement);

  const menu = await fetchMenu();
  const product = isProductInCart(menu, productElement);
  return product;

  // if (product) {
  //   addProductToCart(product); // Lägg till i localStorage
  //   updateCartAlert(); // Uppdatera siffran i varukorgen
  //   // updateCartAlertTest(product);
  // } else {
  //   // console.error("Kunde inte hitta rätten med ID:", productId);
  // }
}

//Letar upp ett element i en arrayen
function isProductInCart(data, element) {
  const product = data.find((item) => item.id === Number(element.dataset.id));
  return product;
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

//Scrollknappar menylista
export function setupScrollBtn() {
  const buttons = getElements(`.scroll-container__button`);

  buttons.forEach((button) => {
    button.addEventListener(`click`, (event) => {
      upOrDown(event);
    });
  });
}

//Tryckte anv. på upp- eller nedknappen?
function upOrDown(event) {
  if (event.currentTarget.id === `scrollButtonUp`) {
    scrollList(-100);
  } else if (event.currentTarget.id === `scrollButtonDown`) {
    scrollList(100);
  }
}

function scrollList(scrollpixels) {
  const scrollDiv = getElement(`.list-section`);

  scrollDiv.scrollBy({
    top: scrollpixels,
    behavior: "smooth",
  });
}

//Lyssnare på cart-knappen
export function setupCartBtnListener() {
  console.log(`setupCartBtnListener()`);
  getElement(`#cartBtn`).addEventListener(`click`, showCart);
}

export function setupCloseCartListerner() {
  console.log(`setupCloseCartListerner()`);
  getElement(`#cartCloseButton`).addEventListener(`click`, () => {
    addClasses(getElement(`#cartModal`), [`d-none`]);
    removeClasses(getElement(`#bodyPage`), [`page--black-white-opacity`]);
  });
}
