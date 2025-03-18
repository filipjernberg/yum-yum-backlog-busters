import { getElement, getElements, styleElement } from "./domUtils.js";
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
import { fetchMenu } from "./api.js";

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

      //Vad ska hända när vi loggats in? ändra role?
    } catch (error) {
      console.error(`Fel vid registrering: ${error.message}`);
      displayErrorMessages(errorMessages, [`Fel vid registrering: ${error.message}`]);
    }
  });
}
