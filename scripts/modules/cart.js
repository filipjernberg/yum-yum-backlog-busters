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
} from "./eventHandlers.js";
import { setLocalStorage, getFromLocalStorage, removeFromLocalStorage, getUserData, setUserData } from "./localStorageUtils.js";
import { generateConfirmationNumber } from "./utils.js";
import { createTotalContainer } from "./receipts.js";
import { getUsers, saveUsers } from "./formUtils.js";

//Lyssnare på add-knappen ligger nu i eventHandlers och anropas samtidigt som knappen skapas.

//Originalkod addToCartListener.
// export async function addToCartListener() {
//   console.log("addToCartListener()");

//   const menu = await fetchMenu();

//   setTimeout(() => {
//     const menuButtons = getElements(".list-item__quantity-button");

//     menuButtons.forEach((button) => {
//       button.addEventListener("click", (event) => {
//         console.log("Klick på:", event.target.closest(".list-item"));

//         const productElement = event.target.closest(".list-item");
//         const productId = Number(productElement.dataset.id); // Konvertera till nummer

//                 if (product) {
//                     addProductToCart(product); // Lägg till i localStorage
//                     updateCartAlert(); // Uppdatera siffran i varukorgen
//                 } else {
//                     console.error("Kunde inte hitta rätten med ID:", productId);
//                 }
//             });

//             button.addEventListener("keydown", (e) => {
//                 if (e.key === "Enter" || e.key === " ") {
//                     e.preventDefault();
//                     button.click();
//                 }
//             });
//         });
//     }, 500);
// }

//         if (product) {
//           addProductToCart(product); // Lägg till i localStorage
//           updateCartAlert(); // Uppdatera siffran i varukorgen
//         } else {
//           console.error("Kunde inte hitta rätten med ID:", productId);
//         }
//       });
//     });
//   }, 500);
// }

export function addProductToCart(event, product, button) {
  let userData = getUsers();
  // getUserData();
  let currentUser = userData.currentUser;

  let userCart = currentUser.cart || [];
  // let userCart = userData.cart;

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
  // userData.cart = userCart;

  let allUsers = userData.allUsers.map((user) => (user.username === currentUser.username ? { ...user, cart: userCart } : user));

  userData.allUsers = allUsers;
  userData.currentUser = currentUser;

  setLocalStorage(`users`, userData);
  // setUserData(userData);
  updateCartAlert();
}

// Originalkod
// export function addProductToCart(product) {
//   let userData = getUserData();
//   let cart = userData.cart;

//   let existingProduct = cart.find((item) => item.id === product.id);
//   if (existingProduct) {
//     existingProduct.quantity += 1;
//   } else {
//     cart.push({ ...product, quantity: 1 });
//   }

//   userData.cart = cart;
//   setUserData(userData);
// }

export function updateCartAlert() {
  const cartIcon = getElement("#cartAlert");
  const userData = getUserData();
  let totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
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

//Originalkod
// export function updateCartAlert() {
//   const cartIcon = getElement("#cartAlert");
//   const userData = getUserData();
//   let totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
//   cartIcon.textContent = totalItems;
// }

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
  toggleClasses(getElement(`#bodyPage`), [`page--black-white-opacity`]);
  createCart();
  removeOrderButton();
  setupOrderButton();
}

async function createCart() {
  const modal = getElement(`#cartModal`);
  // const user = getFromLocalStorage(`usersData`);
  //Kontrollfunktion för att se om varukorgen finns hos usersData eller userName
  // const cart = getFromLocalStorage(`usersData`).guest.cart;
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
  const confirmOrderBtn = createElement("button", ["button", "button--margin-bottom"], { id: "addOrder" }, "bekräfta order");
  const deleteCartBtn = createElement("button", ["button", "button--margin-bottom"], { id: "removeOrder" }, "töm varukorgen");
  appendChildren(modal, createTotalContainer(calcTotalPrice(cart)), confirmOrderBtn, deleteCartBtn);

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
  const listItem = createElement("li", ["list-item"], { "data-id": item.id, id: `cartListItem` });
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
