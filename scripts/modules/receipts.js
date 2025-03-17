import { appendChildren, createElement, createList, getElement } from "./domUtils.js";
import { getFromLocalStorage } from "./localStorageUtils.js";

export async function createReceipts() {
  const orderHistory = getFromLocalStorage("orderHistory") || [];
  const cart = getFromLocalStorage("cart") || [];

  let firstReceipt;

  if (cart.length > 0) {
    firstReceipt = await createReceipt(cart, "new");
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

  //Fix total for "cart", then remove this?
  if (type === "new") {
    formattedDate = "I din kundvagn";
    formattedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    totalAmount = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  } else {
    const timestamp = new Date(order.timestamp);
    formattedDate = timestamp.toLocaleDateString();
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

  if (type === "new") {
    appendChildren(newReceiptContainer, receipt);
  } else {
    appendChildren(previousReceiptContainer, receipt);
  }

  return receipt;
}

function toggleReceipt(selectedReceipt, forceOpen = false) {
  document.querySelectorAll(".receipt__details").forEach((details) => {
    if (details !== selectedReceipt.querySelector(".receipt__details")) {
      details.style.maxHeight = "0px";
    }
  });

  const details = selectedReceipt.querySelector(".receipt__details");
  if (forceOpen || details.style.maxHeight === "0px" || !details.style.maxHeight) {
    details.style.maxHeight = details.scrollHeight + 800 + "px";
  } else {
    details.style.maxHeight = "0px";
  }
}

export async function displayOrderHistory() {
  const adminPage = getElement("#adminContainer");
  const orderHistory = getFromLocalStorage("orderHistory") || [];

  if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
    adminPage.innerHTML = "<p>Ingen orderhistorik tillgänglig.</p>";
    return;
  }
  // Skapar upp en div för alla tidigare beställningar med klass och id
  const previousReceiptContainer = createElement("div", ["receipt__container"], { id: "adminReceipts" });
  appendChildren(adminPage, previousReceiptContainer);

  // Gör previousReceiptContainer global så att createReceipt kan använda den
  window.previousReceiptContainer = previousReceiptContainer;
  // loopar igenom beställningarna och skapar upp ett kvitto för varje beställning som ligger i orderHistory
  for (const order of orderHistory) {
    const receipt = await createReceipt(order, "previous");
    appendChildren(previousReceiptContainer, receipt);
  }
}
