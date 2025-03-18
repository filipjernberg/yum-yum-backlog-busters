import { getElement, getElements } from "./domUtils.js";
import { setLocalStorage, getFromLocalStorage, getUserData, setUserData } from "./localStorageUtils.js";
import { fetchMenu } from "./api.js";
import { setupOrderButton } from "./eventHandlers.js";

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

            button.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }, 500);
}

function addProductToCart(product) {
    let userData = getUserData();
    let cart = userData.cart;

    let existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    userData.cart = cart;
    setUserData(userData);
}

export function updateCartAlert() {
    const cartIcon = getElement("#cartAlert");
    const userData = getUserData();
    let totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartIcon.textContent = totalItems;
}

//Om man vill läsa in senaste ordern från local Storage
export function latestOrder() {
    const userData = getUserData();
    const orders = userData.orderHistory;

    if (orders.length === 0) return;

    const latestOrder = orders[orders.length - 1];
    const orderId = getElement("#orderId");
    orderId.textContent = `#${latestOrder.id}`;
    console.log(latestOrder.id);
}
