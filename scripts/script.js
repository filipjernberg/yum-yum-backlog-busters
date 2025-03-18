//Import
import {
  createList,
  createScrollList,
  createElement,
  appendChildren,
  getElement,
  removeClasses,
  addClasses,
  menuFilter,
} from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
import {
  setupOrderButton,
  setupSingleReceipt,
  setupScrollBtn,
  removeOrderButton,
  registerUser,
  loginUser,
  setupRegistrationBtn,
  filterListener,
  setupCartBtnListener,
} from "./modules/eventHandlers.js";
import { latestOrder } from "./modules/cart.js";
import { checkParams, getParams } from "./modules/utils.js";
import { createReceipts } from "./modules/receipts.js";
import { getFromLocalStorage } from "./modules/localStorageUtils.js";
import { updateCartAlert } from "./modules/cart.js";

// displayOrderHistory
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
      // setupOrderButton();
      createContent("Meny", fetchMenu());
      // addToCartListener();
      // removeOrderButton();
      updateCartAlert();
      setupCartBtnListener();

      break;
    case "/pages/map.html":
      //Page specific code goes here
      updateCartAlert();
      setupCartBtnListener();
      break;
    case "/pages/receipts.html":
      //Page specific code goes here
      createReceipts();
      setupSingleReceipt();
      checkParams(getParams());
      updateCartAlert();
      setupCartBtnListener();
      // displayOrderHistory();
      break;
    case "/pages/user-page.html":
      checkParams(getParams());
      loginUser();
      setupRegistrationBtn();
      //Page specific code goes here
      break;
    default:
      return "unknown";
  }
}
//-----------------------------------------------
async function createContent(heading, list) {
  const contentHeading = createElement("h1", ["content__title"], {}, heading);
  const filterContainer = menuFilter();

  const scrollList = await createScrollList(await list, "menu");
  console.log(content);

  appendChildren(content, contentHeading, filterContainer, scrollList);
  setupScrollBtn();
  filterListener();
}

export async function updateMenu(filter) {
  const menuContainer = getElement(".list-section");
  menuContainer.innerHTML = "";

  const menuList = await createList(filter, "menu"); // Skapa en ny lista med filtrerade rätter
  appendChildren(menuContainer, menuList);
  addToCartListener();
  //   const scrollList = await createScrollList(await list, "menu");
  //   appendChildren(content, contentHeading, scrollList);
  //   setupScrollBtn();
}
