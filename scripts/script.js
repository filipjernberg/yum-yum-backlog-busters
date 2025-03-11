//Import
import { createList, getElement, removeClasses, addClasses } from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
import { setupOrderButton } from "./modules/eventHandlers.js";
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
    case "/Pages/food-menu.html":
      setupOrderButton();
      getMenu();

      break;
    case "/pages/map.html":
      //Page specific code goes here
      break;
    case "/pages/receipts.html":
      //Page specific code goes here

      const confirmationSectionref = getElement(`#wrapperOrderConfirmation`);
      const orderWrapperRef = getElement(`#wrapperOrders`);
      if (confirmationSectionref) {
        addClasses(confirmationSectionref, [`d-none`]);
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get(`showConfirmation`) === `true`) {
        removeClasses(confirmationSectionref, [`d-none`]);
        addClasses(orderWrapperRef, [`d-none`]);
      }
      break;
    case "/pages/user-page.html":
      //Page specific code goes here
      break;
    default:
      return "unknown";
  }
}
//-----------------------------------------------

//Test function for printing menu
async function getMenu() {
  try {
    const menuData = await fetchMenu();
    createList(menuData, menuListItems);
  } catch (error) {
    console.error("Error fetching menu", error);
  }
}
