//Import
import { createList, createElement, appendChildren, getElement, removeClasses, addClasses } from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
import { setupOrderButton, setupSingleReceipt } from "./modules/eventHandlers.js";
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
        addClasses(receiptwrapperRef, [`wrapper--flex`]);
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

async function createContent(heading, array) {
  const contentHeading = createElement("h1", ["text-light"], {}, heading);
  const contentList = createElement("ul", [], { id: "listItems" });

  appendChildren(content, contentHeading, contentList);

  createList(await array, listItems);
}
