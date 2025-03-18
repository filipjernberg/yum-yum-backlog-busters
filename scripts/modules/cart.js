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
import { setLocalStorage, getFromLocalStorage, getUserData, setUserData } from "./localStorageUtils.js";
import { fetchMenu } from "./api.js";
import { removeOrderButton, setupCloseCartListerner, setupOrderButton } from "./eventHandlers.js";

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

//Originalkod
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

//         // Hämta rätt produkt från menyn
//         const product = menu.find((item) => item.id === productId);
//         console.log(product);

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
  const cart = getFromLocalStorage(`cart`);
  resetCartList(getElement(`.cart__list`));

  const listSection = createElement("ul", ["list-section", "cart__list"]);

  cart.forEach((item) => {
    const listItem = createCartItem(item);
    appendChildren(listSection, listItem);
  });

  appendChildren(modal, listSection);
  const confirmOrderBtn = createElement("button", ["button", "button--margin-bottom"], { id: "addOrder" }, "bekräfta order");
  const deleteCartBtn = createElement("button", ["button", "button--margin-bottom"], { id: "removeOrder" }, "töm varukorgen");
  appendChildren(modal, confirmOrderBtn, deleteCartBtn);
}

function resetCartList(element) {
  if (element) {
    removeElement(element);
    removeElement(getElement(`#addOrder`));
    removeElement(getElement(`#removeOrder`));
  }
}

function createCartItem(item) {
  console.log(`createCartItem()`);
  const listItem = createElement("li", ["list-item"], { "data-id": item.id });
  const rowOne = createElement("div", ["list-item__row"]);
  const rowTwo = createElement("div", ["list-item__row"]);

  let itemName, itemPrice, itemTotalPrice, itemInfo;

  itemName = createElement("h3", ["list-item__name", "list-item__name--small"], {}, item.name);
  itemPrice = createElement("h3", ["list-item__price", "list-item__price--small"], {}, `${item.price} SEK`);
  itemTotalPrice = createElement("h4", ["list-item__total", "list-item__info--small"], {}, `Totalt: ${item.quantity * item.price} SEK`);
  console.log(itemTotalPrice);

  itemInfo = createElement("h4", ["list-item__info", "list-item__info--small"], {}, `Antal: ${item.quantity || 1}`);

  const dottedLine = createElement("hr", ["list-item__hr"], {});

  appendChildren(rowOne, itemName, dottedLine, itemPrice);
  appendChildren(rowTwo, itemTotalPrice, itemInfo, createCartQuantityBtns());
  appendChildren(listItem, rowOne, rowTwo);
  return listItem;
}

function createCartQuantityBtns() {
  console.log(`createCartQuantityBtns`);
  const quantityDiv = createElement(`div`);
  return quantityDiv;
}
