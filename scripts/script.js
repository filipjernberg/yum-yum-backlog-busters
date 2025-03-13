//Import
import { createList, createElement, appendChildren, getElement, removeClasses, addClasses } from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
import { setupOrderButton, setupSingleReceipt } from "./modules/eventHandlers.js";
import { checkParams, getParams, timer } from "./modules/utils.js";
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

      break;
    case "/pages/map.html":
      //Page specific code goes here
      break;
    case "/pages/receipts.html":
      //Page specific code goes here
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

async function createContent(heading, array) {
  const contentHeading = createElement("h1", ["text-light"], {}, heading);
  const contentList = createElement("ul", [], { id: "listItems" });

  appendChildren(content, contentHeading, contentList);

  createList(await array, listItems);
}
