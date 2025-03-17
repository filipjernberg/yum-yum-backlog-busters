import { getElement, getElements } from "./domUtils.js";
import { setLocalStorage, getFromLocalStorage, removeFromLocalStorage } from "./localStorageUtils.js";
import { fetchMenu } from "./api.js";
import { generateConfirmationNumber } from "./utils.js";

export async function addToCartListener() {
  console.log("addToCartListener()");

  const menu = await fetchMenu();

  setTimeout(() => {
    const menuButtons = getElements(".list-item__quantity-button");

    menuButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log("Klick på:", event.target.closest(".list-item"));

        const productElement = event.target.closest(".list-item");
        const productId = Number(productElement.dataset.id); // Konvertera till nummer

        // Hämta rätt produkt från menyn
        const product = menu.find((item) => item.id === productId);
        console.log(product);

        if (product) {
          addProductToCart(product); // Lägg till i localStorage
          updateCartAlert(); // Uppdatera siffran i varukorgen
        } else {
          console.error("Kunde inte hitta rätten med ID:", productId);
        }
      });
    });
  }, 500);
}

function addProductToCart(product) {
  let cart = getFromLocalStorage("cart") || [];

  // Kolla om produkten redan finns i varukorgen
  let existingProduct = cart.find((item) => item.id === product.id); //Kollar ifall den klickade rätten redan finns
  if (existingProduct) {
    existingProduct.quantity += 1; // Ifall den finns ökas quantityn
  } else {
    cart.push({ ...product, quantity: 1 }); //Om ingen rätt hittas kopieras product som klickats och lägger till quantity: 1
  }

  setLocalStorage("cart", cart);
}

export function updateCartAlert() {
  const cartIcon = getElement("#cartAlert");
  let cart = getFromLocalStorage("cart") || [];
  let totalItems = 0;

  for (let item of cart) {
    totalItems += item.quantity;
  }
  console.log(totalItems);

  cartIcon.textContent = totalItems;
}
//Om man vill läsa in senaste ordern från local Storage
export function latestOrder() {
  const orders = getFromLocalStorage("orderHistory");
  const latestOrder = orders[orders.length - 1];
  const orderId = getElement("#orderId");
  orderId.textContent = `#${latestOrder.id}`;

  console.log(latestOrder.id);
}

export function orderCart() {
  const cart = getFromLocalStorage("cart");
  const confirmationNumber = generateConfirmationNumber();

  const orders = {
    ConfirmationNumber: confirmationNumber,
    startTime: Date.now(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Beräkna totalpris
    timestamp: new Date().toISOString(), // sparar tidpunkten då ordern skapas i ett ISO-format (YYYY-MM-DDTHH:mm:ss.sssZ).
  };
  removeFromLocalStorage("cart");

  return orders;
}
