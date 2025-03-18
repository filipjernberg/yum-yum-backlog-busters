import { appendChildren, createElement, createList } from "./domUtils.js";
import { getUserData } from "./localStorageUtils.js";
import { startCountdown } from "./utils.js";

export async function createReceipts() {
    const userData = getUserData();
    const orderHistory = userData.orderHistory || [];
    const pendingOrders = userData.pending || [];
    const cart = userData.cart || [];

    let firstReceipt;

    if (cart.length > 0) {
        firstReceipt = await createReceipt(cart, "new");
    }

    if (Array.isArray(pendingOrders) && pendingOrders.length > 0) {
        for (const pendingOrder of pendingOrders) {
            const receipt = await createReceipt(pendingOrder, "pending");

            startCountdown(new Date(pendingOrder.timestamp).getTime(), "#timerForReceipt", pendingOrder.id);
        }
    }

    if (Array.isArray(orderHistory) && orderHistory.length > 0) {
        for (const order of orderHistory) {
            await createReceipt(order, "previous");
        }
    }

    if (firstReceipt) toggleReceipt(firstReceipt, true);
}

export async function createReceipt(order, type) {
    const receipt = createElement("div", ["receipt", "flex"], {});
    let formattedDate, formattedTime, totalAmount;

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
    const leftcolumn = createElement("div", []);
    const totalText = createElement("h3", ["receipt__total-heading"], {}, "TOTALT");
    const totalAmountEl = createElement("h3", ["receipt__total-amount"], {}, `${totalAmount} SEK`);
    const totalInfo = createElement("p", ["receipt__total-info"], {}, "inkl 20% moms");

    appendChildren(leftcolumn, totalText, totalInfo);
    appendChildren(totalContainer, leftcolumn, totalAmountEl);
    appendChildren(details, totalContainer);

    receipt.addEventListener("click", () => toggleReceipt(receipt));
    appendChildren(receipt, date, time, details);

    const container = type === "previous" ? "#previousReceiptContainer" : "#newReceiptContainer";
    appendChildren(document.querySelector(container), receipt);

    return receipt;
}

//Improved functionality with some help from a friend (chatGPT). Advanced way to make the UI less "jumpy".
function toggleReceipt(selectedReceipt, forceOpen = false) {
    const selectedDetails = selectedReceipt.querySelector(".receipt__details");

    // Step 1: Collapse all other receipts
    const allDetails = document.querySelectorAll(".receipt__details");
    let collapsePromises = [];

    allDetails.forEach((details) => {
        if (details !== selectedDetails && details.style.maxHeight && details.style.maxHeight !== "0px") {
            details.style.maxHeight = "0px";

            // Wait for transition to complete (assuming 0.5s in CSS)
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

    // Step 2: After others collapse, expand selected one
    Promise.all(collapsePromises).then(() => {
        if (forceOpen || selectedDetails.style.maxHeight === "0px" || !selectedDetails.style.maxHeight) {
            selectedDetails.style.maxHeight = selectedDetails.scrollHeight + "px";
        } else {
            selectedDetails.style.maxHeight = "0px";
        }
    });

    // Edge case: if no other receipts were open, still toggle immediately
    if (collapsePromises.length === 0) {
        if (forceOpen || selectedDetails.style.maxHeight === "0px" || !selectedDetails.style.maxHeight) {
            selectedDetails.style.maxHeight = selectedDetails.scrollHeight + "px";
        } else {
            selectedDetails.style.maxHeight = "0px";
        }
    }
}
