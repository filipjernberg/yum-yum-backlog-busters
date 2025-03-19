import { addClasses, getElement, getElements, removeClasses, toggleClasses, styleElement } from "./domUtils.js";
import { fetchMenu } from "./api.js";

import { showCart, addProductToCart, updateCartAlert, updateCartAlertTest } from "./cart.js";

import { saveUserData, saveNewUser, hashPassword, getAllUsers } from "./utils.js";
import {
  getFromLocalStorage,
  setLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage,
  getUserData,
  setUserData,
} from "./localStorageUtils.js";
import {
  displayErrorMessages,
  displaySuccessMessage,
  validateUserInput,
  validateLogin,
  containerBasedOnRole,
  logoutToGuest,
} from "./formUtils.js";
import { updateMenu } from "../script.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    //utkommenterat för har flyttats till egen funktion
    //
    // console.log(`Klick på beställning`);
    // const cart = getFromLocalStorage("cart");

    // const order = {
    //   id: Date.now(), // Unikt order-ID baserat på tid
    //   items: cart,
    //   total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
    //   timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
    // };

    // const orders = getFromLocalStorage("orderHistory") || [];
    // orders.push(order);
    // setLocalStorage("orderHistory", orders);

    // removeFromLocalStorage("cart");

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
    addProductToCart(event, product, button); // Lägg till i localStorage
    updateCartAlert();

    // if (button.id === `addToCartBtn` || button.id === `increaseQuantityBtn`) {
    //   console.log(button.id);

    //   console.log(`increase`);
    //   addProductToCart(product, button); // Lägg till i localStorage
    //   updateCartAlert();
    // } else if (button.id === `decreaseQuantityBtn`) {
    //   console.log(`decrease`);
    // }
  });
}

export function getClickedElementTest(event) {
  const productElement = event.target.closest(".list-item");
  console.log("Klick på:", productElement);
  return productElement;
}

export async function getClickedElement(event) {
  const productElement = event.target.closest(".list-item");
  console.log("Klick på:", productElement);

  const menu = await fetchMenu();
  const product = isProductInCart(menu, productElement);
  console.log(product);

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

export async function filterListener() {
  const filterButtons = getElements(".content__filters");
  const fullMenu = await fetchMenu();
  console.log(filterButtons.length);

  for (let button of filterButtons) {
    button.addEventListener("click", (event) => {
      console.log(event.target);
      const selectedFilter = event.target.dataset.filter;
      console.log(selectedFilter);
      let filteredMenu;

      if (selectedFilter === "alla") {
        filteredMenu = fullMenu;
      } else {
        filteredMenu = fullMenu.filter((item) => item.type === selectedFilter);
      }

      updateMenu(filteredMenu);
    });
  }
}

// Beställ knapp på food-menu.html
export function setupRegistrationBtn() {
  const registerUserBtn = getElement(`#registerUser`);
  console.log(`här är registreringsknappen: ${registerUserBtn}`);

  registerUserBtn.addEventListener(`click`, function (event) {
    event.preventDefault();

    let originalUrl = this.href;
    let newUrl = new URL(originalUrl, window.location.origin);

    newUrl.searchParams.set("registrationForm", "true");

    window.location.href = newUrl;
  });
}

export function registerUser() {
  const registerFormRef = getElement(`#registerForm`);
  const submitUserBtn = getElement(`#registerSubmit`);

  console.log(`du har nått formuläret`);

  registerFormRef.addEventListener(`submit`, async function (event) {
    event.preventDefault();

    const username = getElement(`#registerUsername`).value;
    const email = getElement(`#registerMail`).value;
    const password = getElement(`#registerPasswordOne`).value;
    const confirmPassword = getElement(`#registerPasswordtwo`).value;

    const errorMessages = getElement("#registrationError");

    styleElement(errorMessages, `color`, `red`);
    errorMessages.innerHTML = ``;

    try {
      const allUsers = await getAllUsers();
      console.log(allUsers, `var det här alla?`);

      const validationErrors = validateUserInput(username, email, password, confirmPassword, allUsers);

      if (validationErrors.length > 0) {
        displayErrorMessages(errorMessages, validationErrors);
        return;
      }

      const hashedPassword = await hashPassword(password);
      saveNewUser(username, email, hashedPassword);

      displaySuccessMessage();
    } catch (error) {
      console.error(`Fel vid registrering: ${error.message}`);
      displayErrorMessages(errorMessages, [`Fel vid registrering: ${error.message}`]);
    }
  });
}

// login user
export function loginUser() {
  const loginFormRef = getElement(`#loginForm`);

  console.log(`du har nått formuläret`);

  loginFormRef.addEventListener(`submit`, async function (event) {
    event.preventDefault();

    const username = getElement(`#loginUsername`).value;
    console.log(`mitt username:`, username);

    const password = getElement(`#loginPassword`).value;

    const errorMessages = getElement("#loginError");

    styleElement(errorMessages, `color`, `red`);
    errorMessages.innerHTML = ``;

    try {
      const validationErrors = await validateLogin(username, password);

      if (validationErrors.length > 0) {
        displayErrorMessages(errorMessages, validationErrors);
        return;
      }
      console.log(`Du loggades in! `);
      containerBasedOnRole();

      //Vad ska hända när vi loggats in? ändra role?
    } catch (error) {
      console.error(`Fel vid registrering: ${error.message}`);
      displayErrorMessages(errorMessages, [`Fel vid registrering: ${error.message}`]);
    }
  });
}

export function logout(btn) {
  const logoutBtn = getElement(btn);

  logoutBtn.addEventListener(`click`, () => {
    logoutToGuest();
    containerBasedOnRole();
  });
}
