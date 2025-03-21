import {
  getElement,
  getElements,
  removeClasses,
  toggleClasses,
  createElement,
  appendChildren,
  createList,
  removeElement,
} from "./domUtils.js";
// import { fetchMenu } from "./api.js";
import {
  removeOrderButton,
  setupCloseCartListerner,
  setupOrderButton,
  setupQuantityBtnListener,
  getClickedElementTest,
  loginUser,
  setupClickOutsideModalListener,
} from "./eventHandlers.js";
import { setLocalStorage, getFromLocalStorage, removeFromLocalStorage, getUserData, setUserData } from "./localStorageUtils.js";
import { generateConfirmationNumber } from "./utils.js";
import { createTotalContainer } from "./receipts.js";
import { getUsers, saveUsers } from "./users.js";
import { startCountdown } from "./timer.js";

export function addProductToCart(event, product, button) {
  let userData = getUsers();
  let currentUser = userData.currentUser;

  if (!currentUser) return;
  let userCart = currentUser.cart || [];
  console.log(`cart inuti addProducttoCart`, userCart);

  let existingProduct = userCart.find((item) => item.id === product.id);
  let clickedElement = getClickedElementTest(event);
  let quantityElement = clickedElement.querySelector(".list-item__info");
  let totalElement = clickedElement.querySelector(`.list-item__total`);
  let totalPriceElement = getElement(`.receipt__total-amount`);

  if (existingProduct && button.classList.contains(`list-item__quantity-button`)) {
    existingProduct.quantity += 1;
  } else if (existingProduct && button.classList.contains(`list-item__increase`)) {
    existingProduct.quantity += 1;
    quantityElement.textContent = existingProduct.quantity;
    totalElement.textContent = `Totalt ${existingProduct.quantity * existingProduct.price} SEK`;
    totalPriceElement.textContent = `${calcTotalPrice(userCart)} SEK`;
  } else if (!existingProduct && button.classList.contains(`list-item__quantity-button`)) {
    userCart.push({ ...product, quantity: 1 });
  } else if (existingProduct && button.classList.contains(`list-item__decrease`)) {
    existingProduct.quantity -= 1;
    quantityElement.textContent = existingProduct.quantity;
    totalElement.textContent = `Totalt ${existingProduct.quantity * existingProduct.price} SEK`;
    totalPriceElement.textContent = `${calcTotalPrice(userCart)} SEK`;

    // Om antalet är 0 på en produkt filtreras den bort ur arrayen.
    if (existingProduct.quantity === 0) {
      userCart = userCart.filter((item) => item.id !== product.id);
      removeElement(clickedElement);
    }
  }

  currentUser.cart = userCart;

  userData.currentUser = currentUser;
  console.log(`sparar currentuser ner i users:`, userData.currentUser);
  saveUsers(userData);
  updateCartAlert();
}

export function updateCartAlert() {
  const cartIcon = getElement("#cartAlert");
  let userData = getUsers();
  console.log(`users localstorage:`, userData);

  const currentUser = userData.currentUser || [];
  console.log(`currentuser localstorage:`, currentUser);
  const cart = currentUser.cart || [];
  console.log(`cart localstorage:`, cart);
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartIcon.textContent = totalItems;
}

export async function updateCartAlertTest(item) {
  const cartIcon = await getElement(`.list-item__info`);
  console.log(cartIcon);

  const userData = getUserData();
  console.log(userData.cart);

  let totalItems = userData.cart.item.quantity;
  console.log(totalItems);

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

export function showCart() {
  console.log(`showCart()`);
  setupCloseCartListerner();
  toggleClasses(getElement(`#cartModal`), [`d-none`]);
  toggleClasses(getElement(`#cartModal`), [`flex`]);
  toggleClasses(getElement(`#bodyPage`), [`page--black-white-opacity`]);
  createCart();
  removeOrderButton();
  setupOrderButton();
  cartModalState();
}

function cartModalState() {
  if (getElement(`#cartModal`).classList.contains(`d-none`)) {
    location.reload();
  } else if (!getElement(`#cartModal`).classList.contains(`d-none`)) {
    getElement(`#cartModal`).setAttribute("aria-hidden", "false");
    getElement(`#cartModal`).setAttribute("aria-modal", "true");

    setupClickOutsideModalListener();
  }
}

async function createCart() {
  const modal = getElement(`#cartModal`);
  let userData = getUsers(`users`);
  let currentUser = userData.currentUser;
  let cart = currentUser.cart || [];

  resetCartList(getElement(`.cart__list`));

  const listSection = createElement("ul", ["list-section", "cart__list"]);

  cart.forEach((item) => {
    const listItem = createCartItem(item);
    appendChildren(listSection, listItem);
  });

  appendChildren(modal, listSection);
  const confirmOrderBtn = createElement(
    "button",
    ["button", "button--margin-bottom", "cart__confirm-button"],
    { id: "addOrder" },
    "Bekräfta order"
  );
  const deleteCartBtn = createElement("button", ["cart__clear-button"], { id: "removeOrder" }, "Töm varukorgen?");
  appendChildren(modal, confirmOrderBtn, deleteCartBtn, createTotalContainer(calcTotalPrice(cart)));

  userData.allUsers = userData.allUsers.map((user) => (user.username === currentUser.username ? { ...user, cart: cart } : user));

  saveUsers(userData);
}

function calcTotalPrice(cart) {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.price * cartItem.quantity;
  });
  return total;
}

function resetCartList(element) {
  if (element) {
    removeElement(element);
    removeElement(getElement(`#addOrder`));
    removeElement(getElement(`#removeOrder`));
    removeElement(getElement(`.receipt__total`));
  }
}

function createCartItem(item) {
  console.log(`createCartItem()`);
  const listItem = createElement("li", ["list-item", "list-item--receipt"], { "data-id": item.id, id: `cartListItem` });
  const rowOne = createElement("div", ["list-item__row"]);
  const rowTwo = createElement("div", ["list-item__row"]);

  let itemName, itemPrice, itemTotalPrice, itemInfo;

  itemName = createElement("h3", ["list-item__name", "list-item__name--small"], {}, item.name);
  itemPrice = createElement("h3", ["list-item__price", "list-item__price--small"], {}, `${item.price} SEK`);
  itemTotalPrice = createElement("h4", ["list-item__total", "list-item__info--small"], {}, `Totalt: ${item.quantity * item.price} SEK`);
  console.log(itemTotalPrice);

  const dottedLine = createElement("hr", ["list-item__hr"], {});

  appendChildren(rowOne, itemName, dottedLine, itemPrice);
  appendChildren(rowTwo, itemTotalPrice, createCartQuantityBtns(item));
  appendChildren(listItem, rowOne, rowTwo);
  return listItem;
}

function createCartQuantityBtns(item) {
  console.log(`createCartQuantityBtns`);
  const quantityDiv = createElement(`div`, [`flex-row`, `list-item__quantityDiv`]);
  const decreaseBtn = createElement(`img`, [`list-item__decrease`], {
    role: `button`,
    src: `../../resources/icons/remove-minus-w300.svg`,
    id: `decreaseQuantityBtn`,
  });
  const itemInfo = createElement("h4", ["list-item__info", "list-item__info--small"], {}, item.quantity);
  const increaseBtn = createElement(`img`, [`list-item__increase`], {
    role: `button`,
    src: `../../resources/icons/add-plus-w300.svg`,
    id: `increaseQuantityBtn`,
  });

  setupQuantityBtnListener(decreaseBtn);
  setupQuantityBtnListener(increaseBtn);
  appendChildren(quantityDiv, decreaseBtn, itemInfo, increaseBtn);
  return quantityDiv;
}

function removeCartListItem() {
  console.log(`removeCartListItem()`);

  const listItem = getElement(`#cartListItem`);
  console.log(listItem);
}

export function orderCart(element) {
  console.log(`ordercart`);

  // const cart = getFromLocalStorage("cart");
  const userData = getUsers();
  let currentUser = userData.currentUser;
  let cart = currentUser.cart || [];

  if (cart.length === 0) {
    console.warn(`varukorgen är tom, ingen order skapad.`);
    return;
  }
  const confirmationNumber = generateConfirmationNumber();

  const newOrder = {
    ConfirmationNumber: confirmationNumber,
    startTime: Date.now(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
    timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
  };

  currentUser.pending = currentUser.pending || []; // Säkerställ att orderHistorik finns
  currentUser.pending.push(newOrder); // Lägg till nya ordern

  currentUser.cart = [];

  userData.currentUser = currentUser;
  saveUsers(userData);

  console.log("Order lagd i pending:", newOrder);

  saveUsers(userData); // Spara den tomma varukorgen för den aktuella användaren
  startCountdown(newOrder.startTime, element, newOrder.ConfirmationNumber);

  return newOrder;
}

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
