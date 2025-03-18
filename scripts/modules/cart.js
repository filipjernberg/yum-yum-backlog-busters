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
import { setLocalStorage, getFromLocalStorage } from "./localStorageUtils.js";
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
  let cart = getFromLocalStorage("cart") || [];

  // Kolla om produkten redan finns i varukorgen
  let existingProduct = cart.find((item) => item.id === product.id); //Kollar ifall den klickade rätten redan finns
  if (existingProduct) {
    existingProduct.quantity += 1; // Ifall den finns ökas quantityn
  } else {
    cart.push({ ...product, quantity: 1 }); //Om ingen rätt hittas kopieras product som klickats och lägger till quantity: 1
  }

  setLocalStorage("cart", cart);
}

export function updateCartAlert() {
  const cartIcon = getElement("#cartAlert");
  let cart = getFromLocalStorage("cart") || [];
  let totalItems = 0;

  for (let item of cart) {
    totalItems += item.quantity;
  }
  console.log(totalItems);

  cartIcon.textContent = totalItems;
}

//Om man vill läsa in senaste ordern från local Storage
export function latestOrder() {
  const orders = getFromLocalStorage("orderHistory");
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
  getCartList();
  createCart();
  removeOrderButton();
  setupOrderButton();
}

function getCartList() {
  console.log(`getCartList()`);
}

async function createCart() {
  const modal = getElement(`#cartModal`);
  const cart = getFromLocalStorage(`cart`);

  if (getElement(`.cart__list`)) {
    removeElement(getElement(`.cart__list`));
  }

  const listSection = createElement("ul", ["list-section", "cart__list"]);

  cart.forEach((item) => {
    const listItem = createCartItem(item);
    appendChildren(listSection, listItem);
  });

  appendChildren(modal, listSection);

  // const cartList = await createList(cart, "receipt");
  // console.log(cartList);
  // appendChildren(modal, cartList);
}

function createCartItem(item) {
  console.log(`createCartItem()`);
  const listItem = createElement("li", ["list-item"], { "data-id": item.id });
  const rowOne = createElement("div", ["list-item__row"]);
  const rowTwo = createElement("div", ["list-item__row"]);

  let itemName, itemPrice, itemInfo;

  itemName = createElement("h3", ["list-item__name", "list-item__name--small"], {}, item.name);
  itemPrice = createElement("h3", ["list-item__price", "list-item__price--small"], {}, `${item.price} SEK`);
  itemInfo = createElement("h4", ["list-item__info", "list-item__info--small"], {}, `Antal: ${item.quantity || 1}`);

  const dottedLine = createElement("hr", ["list-item__hr"], {});

  appendChildren(rowOne, itemName, dottedLine, itemPrice);
  appendChildren(rowTwo, itemInfo);
  appendChildren(listItem, rowOne, rowTwo);
  return listItem;
}
