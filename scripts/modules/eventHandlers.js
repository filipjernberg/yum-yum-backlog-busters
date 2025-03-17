import { getElement, getElements, styleElement } from "./domUtils.js";
import { hashPassword, getAllUsers, saveNewUser } from "./utils.js";
import { displayErrorMessages, displaySuccessMessage, validateUserInput } from "./formUtils.js";
import { getFromLocalStorage, setLocalStorage, removeFromLocalStorage, clearLocalStorage } from "./localStorageUtils.js";
import { fetchUsers } from "./api.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    // console.log(`Klick på beställning`);
    // const cart = getFromLocalStorage("cart");

    // const orders = {
    //   id: Date.now(), // Unikt order-ID baserat på tid
    //   items: cart,
    //   total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
    //   timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
    // };

    // // const orders = getFromLocalStorage("orderHistory") || [];
    // // orders.push(order);
    // // setLocalStorage("orderHistory", orders);

    // const users = getFromLocalStorage(`users`);

    // if (users.length === 0) {
    //   console.log(`Ingen användare hittad. Kan inte spara orderdata`);
    //   return;
    // }

    // //Ändra detta senare till att gälla inloggad person istället
    // users[users.length - 1] = {
    //   ...users[users.length - 1], // Behåll tidigare data
    //   orders,
    // };

    // setLocalStorage(`users`, users);

    // removeFromLocalStorage("cart");

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

// Beställ knapp på food-menu.html
export function setupRegistrationBtn() {
  const registerUserBtn = getElement(`#registerUser`);
  console.log(registerUserBtn);

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

      // if (errorMessages.innerHTML === ``) {
      //   const congrats = getElement(`#changeParagraph`);
      //   const newUser = { username, email, password: hashedPassword };

      //   usersFromLocalStorage.push(newUser);
      //   setLocalStorage(`users`, usersFromLocalStorage);
      //   styleElement(congrats, `color`, `green`);
      //   congrats.textContent = `Du har nu skapat ett konto`;
      // }
    } catch (error) {
      console.error(`Fel vid registrering: ${error.message}`);
      displayErrorMessages(errorMessages, [`Fel vid registrering: ${error.message}`]);
    }
  });
}
