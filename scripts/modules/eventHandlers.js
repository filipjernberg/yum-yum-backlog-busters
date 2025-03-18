import { getElement, getElements } from "./domUtils.js";
import { saveUserData } from "./utils.js";
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
