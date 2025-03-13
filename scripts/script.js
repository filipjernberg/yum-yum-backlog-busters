//Import
import { createList, createScrollList, createElement, appendChildren, getElement, removeClasses, addClasses } from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
import { addToCartListener } from "./modules/cart.js";
import { setupOrderButton, setupSingleReceipt, setupScrollBtn, removeOrderButton } from "./modules/eventHandlers.js";
import { removeOrderButton } from "./modules/eventHandlers.js";
//-----------------------------------------------

//Run
handleCurrentPage();
//-----------------------------------------------

function handleCurrentPage() {
  const params = new URLSearchParams(window.location.search);

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
      setupSingleReceipt();

      const confirmationSectionref = getElement(`#wrapperOrderConfirmation`);
      const orderWrapperRef = getElement(`#wrapperOrders`);
      const receiptwrapperRef = getElement(`#wrapperSingleReceipt`);
      const body = getElement(`body`);
      if (confirmationSectionref) {
        confirmationSectionref.style.display = `none`;
      }

      if (params.get(`showConfirmation`) === `true`) {
        confirmationSectionref.style.display = `flex`;
        addClasses(orderWrapperRef, [`d-none`]);
        body.style.backgroundColor = `#605858`;
        // Ovan är bara test. behöver komma åt variabelnamn från css
        // DOM funktion för att ändra style?
      }
      if (params.get(`showSingleReceipt`) === `true`) {
        addClasses(receiptwrapperRef, [`wrapper__flex`]);
        addClasses(orderWrapperRef, [`d-none`]);
        body.style.backgroundColor = `#605858`;
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
async function createContent(heading, list) {
  const contentHeading = createElement("h1", [], {}, heading);
  const scrollList = await createScrollList(await list);
  appendChildren(content, contentHeading, scrollList);
  setupScrollBtn();
}
