//Basic Utilities
export function createElement(tag, classNames = [], attributes = {}, textContent = "") {
    const element = document.createElement(tag);
    if (classNames.length) element.classList.add(...classNames);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    element.textContent = textContent;
    return element;
}

export function appendChildren(parent, ...children) {
    if (parent) children.forEach((child) => parent.appendChild(child));
}

export function removeElement(element) {
    element.remove();
}

export function removeClasses(element, classNames) {
    if (classNames.length) element.classList.remove(...classNames);
}

export function addClasses(element, classNames = []) {
    if (classNames.length) element.classList.add(...classNames);
}

export function getElement(selector) {
    return document.querySelector(selector);
}

export function getElements(selector) {
    return document.querySelectorAll(selector);
}
//-----------------------------------------------

//List Utilities
export async function createList(list, section) {
    list.forEach((item) => {
        const listItem = createListItem(item);
        section.appendChild(listItem);
    });
}

function createListItem(item) {
    const listItem = createElement("div", ["list-item"]);
    const rowOne = createElement("div", ["list-item__row"]);
    const rowTwo = createElement("div", ["list-item__row"]);

    const dishName = createElement("h2", ["list-item__h2"], {}, item.name);
    const dottedLine = createElement("hr", ["list-item__hr"], {});
    const dishPrice = createElement("h2", ["list-item__h2"], {}, item.price + " SEK");

    //Only for food menu. Needs work for receipts etc.
    const dishInfo = createElement("h4", ["list-item__h4"], {}, item.ingredients);
    const quantityButton = createElement("button", ["list-item__quantity-button"], {}, "Add");

    appendChildren(rowOne, dishName, dottedLine, dishPrice);
    appendChildren(rowTwo, dishInfo, quantityButton);
    appendChildren(listItem, rowOne, rowTwo);

    return listItem;
}
//-----------------------------------------------

//Food Menu
function createFoodMenu(list) {}

function checkType() {
    //check item.type to sort by dish, dip or drink etc.
}

function filterButtons() {
    //create buttons for food menu filtering
}
//-----------------------------------------------
