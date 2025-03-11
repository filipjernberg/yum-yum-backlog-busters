//Import
import { createList, createElement, appendChildren } from "./modules/domUtils.js";
import { fetchMenu } from "./modules/api.js";
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
            createContent("Meny", fetchMenu());
            break;
        case "/pages/map.html":
            //Page specific code goes here
            break;
        case "/pages/receipts.html":
            //Page specific code goes here
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
