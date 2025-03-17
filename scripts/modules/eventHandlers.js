import { getElement, getElements, styleElement } from "./domUtils.js";
import { saveUserData } from "./utils.js";
import { getFromLocalStorage, setLocalStorage, removeFromLocalStorage, clearLocalStorage } from "./localStorageUtils.js";
import { fetchUsers } from "./api.js";

// Beställ knapp på food-menu.html
export function setupOrderButton() {
  const addOrderBtn = getElement(`#addOrder`);
  console.log(addOrderBtn);

  addOrderBtn.addEventListener(`click`, function () {
    console.log(`Klick på beställning`);
    const cart = getFromLocalStorage("cart");

    const order = {
      id: Date.now(), // Unikt order-ID baserat på tid
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
      timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
    };

    const orders = getFromLocalStorage("orderHistory") || [];
    orders.push(order);
    setLocalStorage("orderHistory", orders);

    removeFromLocalStorage("cart");

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

    errorMessages.innerHTML = ``;

    try {
      const usersFromAPI = await fetchUsers();
      const usersFromLocalStorage = getFromLocalStorage(`users`);

      const allUsers = [...usersFromAPI, ...usersFromLocalStorage];

      const userExists = allUsers.some((user) => user.username === username || user.email === email);

      if (userExists) {
        if (allUsers.some((user) => user.username === username)) {
          console.log(`Användarnamnet är upptaget`);

          errorMessages.innerHTML += `<p>Användarnamnet är upptaget</p>`;
        }
        if (allUsers.some((user) => user.email === email)) {
          console.log(`Mejladressen är redan registrerad.`);

          errorMessages.innerHTML += `<p>Mejladressen är redan registrerad.</p>`;
        }
      }

      if (password !== confirmPassword) {
        console.log(`Lösenorden matchar inte. Försök igen.`);

        errorMessages.innerHTML += `<p>Lösenorden matchar inte. Försök igen.</p>`;
      }

      if (errorMessages.innerHTML === ``) {
        const newUser = { username, email, password };
        usersFromLocalStorage.push(newUser);
        setLocalStorage(`users`, usersFromLocalStorage);

        users.push(newUser);
        setLocalStorage(`users`, users);
      }
    } catch (error) {
      console.error(`Fel vid registrering: ${error.message}`);
      errorMessages.innerHTML += `<p>Fel vid registrering: ${error.message}</p>`;
    }
  });
}
