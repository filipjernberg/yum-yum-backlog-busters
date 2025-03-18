import { appendChildren, createElement, createList, getElement } from "./domUtils.js";
import { getFromLocalStorage, getUserData } from "./localStorageUtils.js";
import { startCountdown } from "./timer.js";

export async function createReceipts() {
    const userData = getUserData();
    const orderHistory = userData.orderHistory || [];
    const pendingOrders = userData.pending || [];
    const cart = userData.cart || [];

    let firstReceipt;

    // Render Cart as "new" receipt
    if (cart.length > 0) {
        firstReceipt = await createReceipt(cart, "new");
    }

    // Render Pending Orders
    if (Array.isArray(pendingOrders) && pendingOrders.length > 0) {
        for (const pendingOrder of pendingOrders) {
            const receipt = await createReceipt(pendingOrder, "pending");
            startCountdown(new Date(pendingOrder.timestamp).getTime(), "#timerForReceipt", pendingOrder.id);
        }
    }

    // Render Order History
    if (Array.isArray(orderHistory) && orderHistory.length > 0) {
        for (const order of orderHistory) {
            await createReceipt(order, "previous");
        }
    }

    // Open first receipt automatically (if cart exists)
    if (firstReceipt) toggleReceipt(firstReceipt, true);
}

export async function createReceipt(order, type) {
    const receipt = createElement("div", ["receipt", "flex"], { "aria-expanded": "false", tabindex: "0" });
    let formattedDate, formattedTime, totalAmount;

    // Toggle receipt on click or Enter key press
    receipt.addEventListener("click", () => {
        const expanded = receipt.getAttribute("aria-expanded") === "true";
        receipt.setAttribute("aria-expanded", expanded ? "false" : "true");
        toggleReceipt(receipt);
    });

    receipt.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const expanded = receipt.getAttribute("aria-expanded") === "true";
            receipt.setAttribute("aria-expanded", expanded ? "false" : "true");
            toggleReceipt(receipt);
        }
    });

    if (type === "new") {
        formattedDate = "I din kundvagn";
        formattedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        totalAmount = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
    } else {
        const timestamp = new Date(order.timestamp);
        formattedDate = type === "pending" ? "Beställning under behandling" : timestamp.toLocaleDateString();
        formattedTime = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        totalAmount = order.total || 0;
    }

    const date = createElement("h2", [], {}, formattedDate);
    const time = createElement("h5", [], {}, formattedTime);
    const cartItems = type === "new" ? order : order.items;

    const details = await createList(cartItems, "receipt");
    if (!details) {
        console.error("Error: createList did not return a valid element");
        return;
    }

    details.classList.add("receipt__details", "hidden");

    const totalContainer = createElement("div", ["receipt__total"]);
    const leftColumn = createElement("div", []);
    const totalText = createElement("h3", ["receipt__total-heading"], {}, "TOTALT");
    const totalAmountEl = createElement("h3", ["receipt__total-amount"], {}, `${totalAmount} SEK`);
    const totalInfo = createElement("p", ["receipt__total-info"], {}, "inkl 20% moms");

    appendChildren(leftColumn, totalText, totalInfo);
    appendChildren(totalContainer, leftColumn, totalAmountEl);
    appendChildren(details, totalContainer);

    appendChildren(receipt, date, time, details);

    const container = type === "previous" ? "#previousReceiptContainer" : "#newReceiptContainer";
    appendChildren(document.querySelector(container), receipt);

    return receipt;
}

function toggleReceipt(selectedReceipt, forceOpen = false) {
    const selectedDetails = selectedReceipt.querySelector(".receipt__details");

    // Collapse all other receipts
    const allDetails = document.querySelectorAll(".receipt__details");
    let collapsePromises = [];

    allDetails.forEach((details) => {
        if (details !== selectedDetails && details.style.maxHeight && details.style.maxHeight !== "0px") {
            details.style.maxHeight = "0px";

            collapsePromises.push(
                new Promise((resolve) => {
                    details.addEventListener("transitionend", function handler() {
                        details.removeEventListener("transitionend", handler);
                        resolve();
                    });
                })
            );
        }
    });

    // Expand selected after others collapse
    Promise.all(collapsePromises).then(() => {
        if (forceOpen || selectedDetails.style.maxHeight === "0px" || !selectedDetails.style.maxHeight) {
            selectedDetails.style.maxHeight = selectedDetails.scrollHeight + "px";
        } else {
            selectedDetails.style.maxHeight = "0px";
        }
    });

    // If no others were open, toggle immediately
    if (collapsePromises.length === 0) {
        if (forceOpen || selectedDetails.style.maxHeight === "0px" || !selectedDetails.style.maxHeight) {
            selectedDetails.style.maxHeight = selectedDetails.scrollHeight + "px";
        } else {
            selectedDetails.style.maxHeight = "0px";
        }
    }
}

// Display all orders on the admin page
// export async function displayOrderHistory() {
//   const adminPage = await getElement("#adminContainer");
//   const orderHistory = getFromLocalStorage("orderHistory");

//   if (!Array.isArray(orderHistory) || orderHistory.length === 0) {

//     adminPage.innerHTML = "<p>Ingen orderhistorik tillgänglig.</p>";
//     console.log(`test2`);

//     return;
//   }

//   const previousReceiptContainer = createElement("div", ["receipt__container"], { id: "adminReceipts" });
//   appendChildren(adminPage, previousReceiptContainer);

//   window.previousReceiptContainer = previousReceiptContainer;

//   for (const order of orderHistory) {
//     const receipt = await createReceipt(order, "previous");
//     appendChildren(previousReceiptContainer, receipt);
//   }
// }
