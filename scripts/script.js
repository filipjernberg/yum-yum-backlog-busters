//Import
import { createList, createScrollList, createElement, appendChildren, getElement, removeClasses, addClasses } from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
import { setupOrderButton, setupSingleReceipt, setupScrollBtn, removeOrderButton } from "./modules/eventHandlers.js";
import { addToCartListener, latestOrder } from "./modules/cart.js";
import { checkParams, getParams } from "./modules/utils.js";
import { createReceipts } from "./modules/receipts.js";
import { getFromLocalStorage } from "./modules/localStorageUtils.js";
//-----------------------------------------------

//Run
handleCurrentPage();
//-----------------------------------------------

function handleCurrentPage() {
    switch (window.location.pathname) {
        case "/":
            break;
        case "/pages/index.html":
            //Page specific code goes here
            break;
        case "/pages/food-menu.html":
            setupOrderButton();
            createContent("Meny", fetchMenu());
            addToCartListener();
            removeOrderButton();

            break;
        case "/pages/map.html":
            //Page specific code goes here
            break;
        case "/pages/receipts.html":
            //Page specific code goes here
            createReceipts();
            setupSingleReceipt();
            checkParams(getParams());
            break;
        case "/pages/user-page.html":
            //Page specific code goes here
            break;
        default:
            return "unknown";
    }
}
//-----------------------------------------------
async function createContent(heading, list) {
    const contentHeading = createElement("h1", ["content__title"], {}, heading);
    const scrollList = await createScrollList(await list, "menu");
    appendChildren(content, contentHeading, scrollList);
    setupScrollBtn();
}
