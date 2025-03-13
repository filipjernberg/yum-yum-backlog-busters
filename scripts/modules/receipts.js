import { appendChildren, createElement, createList } from "./domUtils.js";
import { getFromLocalStorage } from "./localStorageUtils.js";

export async function createReceipt() {
    const receipt = createElement("div", ["receipt", "flex"], {});
    const date = createElement("h2", [], {}, "2025-03-07");
    const time = createElement("h5", [], {}, "11:48");

    const cartItems = getFromLocalStorage("cart") || [];
    console.log("Cart Items from localStorage:", cartItems);

    const details = await createList(cartItems, "receipt");
    console.log("Created details list:", details);

    if (!details) {
        console.error("Error: createList did not return a valid element");
        return;
    }

    details.classList.add("receipt__details", "hidden");

    receipt.addEventListener("click", () => {
        if (details.style.maxHeight && details.style.maxHeight !== "0px") {
            details.style.maxHeight = "0px";
        } else {
            details.style.maxHeight = details.scrollHeight + "px";
        }
    });

    appendChildren(receipt, date, time, details);
    appendChildren(newReceiptContainer, receipt);
}
