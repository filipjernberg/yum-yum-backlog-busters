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
  setupQuantityBtnListener,
  logout,
} from "./modules/eventHandlers.js";
import { latestOrder } from "./modules/cart.js";
import { checkParams, getParams } from "./modules/utils.js";
import { createReceipts } from "./modules/receipts.js";
import { getFromLocalStorage } from "./modules/localStorageUtils.js";
import { updateCartAlert } from "./modules/cart.js";
import { initializeUsers, containerBasedOnRole } from "./modules/users.js";

// displayOrderHistory
//-----------------------------------------------

//Run
handleCurrentPage();
initializeUsers();
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
      containerBasedOnRole();
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
// async function createContent(heading, list) {
//   const contentHeading = createElement("h1", ["content__title"], {}, heading);
//   const filterContainer = menuFilter();

//   const scrollList = await createScrollList(await list, "menu");
//   console.log(content);

//   appendChildren(content, contentHeading, filterContainer, scrollList);
//   setupScrollBtn();
//   filterListener();
// }

async function createContent(heading, list) {
  try {
    const contentHeading = createElement("h1", ["content__title"], {}, heading);
    const filterContainer = menuFilter();

    if (!filterContainer) {
      displayError("Kunde inte ladda filtren, uppdatera sidan för att försöka igen!", ".content");
      return;
    }

    const resolvedList = await list;
    if (!resolvedList || !Array.isArray(resolvedList)) {
      displayError("Kunde inte ladda menyn, uppdatera sidan för att försöka igen!", ".content");
      return;
    }

    const scrollList = await createScrollList(resolvedList, "menu");

    appendChildren(content, contentHeading, filterContainer, scrollList);
    setupScrollBtn();
    filterListener();
  } catch (error) {
    displayError("Kunde inte ladda innehållet, uppdatera sidan för att försöka igen!", ".content");
    console.error(error);
  }
}

export async function updateMenu(filter) {
  try {
    const menuContainer = getElement(".list-section");
    if (!menuContainer) {
      displayError("Kunde inte uppdatera menyn, försök igen!", ".content");
      return;
    }

    menuContainer.innerHTML = "";

    if (!Array.isArray(filter)) {
      displayError("Ingen menydata tillgänglig, försök igen!", ".content");
      return;
    }

    const menuList = await createList(filter, "menu"); // Skapa en ny lista med filtrerade rätter
    if (!menuList) {
      displayError("Kunde inte skapa menyn, försök igen!", ".content");
      return;
    }

    await setupQuantityBtnListener(getElement(".filter-button"));
    appendChildren(menuContainer, menuList);
  } catch (error) {
    displayError("Kunde inte uppdatera menyn, försök igen!", ".content");
    console.error(error);
  }
}

// export async function updateMenu(filter) {
//   const menuContainer = getElement(".list-section");
//   menuContainer.innerHTML = "";

//   const menuList = await createList(filter, "menu"); // Skapa en ny lista med filtrerade rätter
//   await setupQuantityBtnListener(getElement(`.filter-button`));
//   appendChildren(menuContainer, menuList);
//   //addToCartListener();

//   //   const scrollList = await createScrollList(await list, "menu");
//   //   appendChildren(content, contentHeading, scrollList);
//   //   setupScrollBtn();
// }
