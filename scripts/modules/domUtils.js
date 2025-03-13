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
export async function createScrollList(list) {
  const scrollContainer = createElement("div", ["scroll-container"]);

  const scrollUp = createElement("button", ["scroll-container__button", "scroll-container__button--up"], { id: "scrollButtonUp" });
  const scrollUpIcon = createElement("img", ["scroll-container__icon"], { src: "../resources/icons/arrow-up-w300.svg" });

  const scrollDown = createElement("button", ["scroll-container__button", "scroll-container__button--down"], { id: "scrollButtonDown" });
  const scrollDownIcon = createElement("img", ["scroll-container__icon"], { src: "../resources/icons/arrow-down-w300.svg" });

  const listContainer = await createList(list);
  appendChildren(scrollUp, scrollUpIcon);
  appendChildren(scrollDown, scrollDownIcon);
  appendChildren(scrollContainer, scrollUp, listContainer, scrollDown);

  return scrollContainer;
}

export async function createList(list) {
  const listSection = createElement("ul", ["list-section"]);
  list.forEach((item) => {
    const listItem = createListItem(item);
    listSection.appendChild(listItem);
  });

  return listSection;
}

function createListItem(item) {
  const listItem = createElement("li", ["list-item"], { "data-id": item.id });
  const rowOne = createElement("div", ["list-item__row"]);
  const rowTwo = createElement("div", ["list-item__row"]);

  const itemName = createElement("h2", [], {}, item.name);
  const dottedLine = createElement("hr", ["list-item__hr"], {});
  const itemPrice = createElement("h2", [], {}, item.price + " SEK");

  //Only for food menu. Needs work for receipts etc.
  const itemInfo = createElement("h4", [], {}, item.ingredients?.length ? item.ingredients.join(", ") : "");
  const quantityButton = createElement("button", ["button", "list-item__quantity-button"], {}, "Add");
  const dottedLineDivider = createElement("hr", ["list-item__hr", "list-item__hr--divider"], {});

  appendChildren(rowOne, itemName, dottedLine, itemPrice);
  appendChildren(rowTwo, itemInfo, quantityButton);
  appendChildren(listItem, rowOne, rowTwo, dottedLineDivider);

  return listItem;
}
//-----------------------------------------------

//Food Menu

function checkType() {
  //check item.type to sort by dish, dip or drink etc.
}

function filterButtons() {
  //create buttons for food menu filtering
}
//-----------------------------------------------
// h1 id="menuTitle" class="heading-one heading-one--light">Meny</h1
