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
import { displayErrorMessages, displaySuccessMessage, validateUserInput, validateLogin } from "./formUtils.js";
import { updateMenu } from "../script.js";
import { getUsers, saveUsers, containerBasedOnRole, logoutToGuest } from "./users.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    window.location.href = "../pages/receipts.html?showConfirmation=true";
  });
}

//Töm varukorgen knapp på food-menu.html
export function removeOrderButton() {
  const removeOrderBtn = getElement(`#removeOrder`);

  removeOrderBtn.addEventListener("click", () => {
    let userData = getUsers();
    let currentUser = userData.currentUser;
    currentUser.cart = [];
    saveUsers(userData);
    location.reload();
  });
}

export async function setupQuantityBtnListener(button) {
  button.addEventListener("click", async (event) => {
    const product = await getClickedElement(event);
    console.log(product);
    addProductToCart(event, product, button); // Lägg till i localStorage
    filterListener();
    updateCartAlert();
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

    window.location.href = "../pages/receipts.html";
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
    location.reload();
  });
}

//Lyssnar efter klick utanför modalen. Anropas i showCart när modalen är öppen
export function setupClickOutsideModalListener() {
  console.log(`setupClickOutsideModalListener()`);
  getElement(`#bodyPage`).addEventListener(`click`, (event) => clickOutsideModal(event));
}

function clickOutsideModal(event) {
  console.log(getElement(`#cartModal`));
  const modal = getElement(`#cartModal`);
  const cartBtn = getElement(`#cartBtn`);
  console.log(event.target);

  if (!modal.contains(event.target) && !cartBtn.contains(event.target)) {
    console.log(`klick utanför modal`);
    location.reload();
  }
}

export async function filterListener() {
  try {
    const filterButtons = getElements(".content__filters");
    const fullMenu = await fetchMenu();

    for (let button of filterButtons) {
      button.addEventListener("click", (event) => {
        try {
          const selectedFilter = event.target.dataset.filter;
          let filteredMenu = selectedFilter === "alla" ? fullMenu : fullMenu.filter((item) => item.type === selectedFilter);

          if (!filteredMenu.length) {
            displayError("Inga produkter hittades för detta filter.", ".content__filters");
            return;
          }

          updateMenu(filteredMenu);
        } catch (error) {
          displayError("Något gick fel vid filtreringen.", ".content__filters");
          console.error(error);
        }
      });
    }
  } catch (error) {
    displayError("Kunde inte hämta menyn. Försök igen senare.", ".content__filters");
    console.error(error);
  }
}

function displayError(message, container) {
  const errorContainer = getElement(container);
  if (errorContainer) {
    errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
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
