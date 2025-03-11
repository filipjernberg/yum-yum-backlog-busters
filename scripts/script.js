//Import
import { createList } from "./modules/domUtils.js";
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
            getMenu();
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

//Test function for printing menu
async function getMenu() {
    try {
        const menuData = await fetchMenu();
        createList(menuData, menuListItems);
    } catch (error) {
        console.error("Error fetching menu", error);
    }
}
