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

export function toggleClasses(element, classNames = []) {
  if (classNames.length) element.classList.toggle(...classNames);
}

export function getElement(selector) {
  return document.querySelector(selector);
}

export function getElements(selector) {
  return document.querySelectorAll(selector);
}
//-----------------------------------------------

//List Utilities
export async function createScrollList(list, type) {
  const scrollContainer = createElement("div", ["scroll-container"]);

  const scrollUp = createElement("button", ["scroll-container__button", "scroll-container__button--up"], { id: "scrollButtonUp" });
  const scrollUpIcon = createElement("img", ["scroll-container__icon"], { src: "../resources/icons/arrow-up-w300.svg" });

  const scrollDown = createElement("button", ["scroll-container__button", "scroll-container__button--down"], { id: "scrollButtonDown" });
  // const scrollUp = createElement("button", ["scroll-container__button-up"], { id: "scrollButtonUp" });
  // const scrollUpIcon = createElement("img", ["scroll-container__icon"], { src: "../resources/icons/arrow-up-w300.svg" });

  // const scrollDown = createElement("button", ["scroll-container__button-down"], { id: "scrollButtonDown" });
  const scrollDownIcon = createElement("img", ["scroll-container__icon"], { src: "../resources/icons/arrow-down-w300.svg" });

  const listContainer = await createList(list, type);

  appendChildren(scrollUp, scrollUpIcon);
  appendChildren(scrollDown, scrollDownIcon);
  appendChildren(scrollContainer, scrollUp, listContainer, scrollDown);

  return scrollContainer;
}

//Originalkod createList
export async function createList(list, type) {
  const listSection = createElement("ul", ["list-section"]);
  list.forEach((item) => {
    const listItem = createListItem(item, type);
    listSection.appendChild(listItem);
  });

  return listSection;
}

//Originalkod createListItem
function createListItem(item, mode) {
  const listItem = createElement("li", ["list-item", `list-item--${mode}`], { "data-id": item.id });
  const rowOne = createElement("div", ["list-item__row"]);
  const rowTwo = createElement("div", ["list-item__row"]);

  let itemName, itemPrice, itemInfo, quantityButton;

  switch (mode) {
    case "menu":
      itemName = createElement("h2", ["list-item__name"], {}, item.name);
      itemPrice = createElement("h2", ["list-item__price"], {}, `${item.price} SEK`);
      itemInfo = createElement("h4", ["list-item__info"], {}, item.ingredients?.length ? item.ingredients.join(", ") : "");
      quantityButton = createElement("button", ["button", "list-item__quantity-button"], {}, "Add");
      break;

    case "receipt":
      itemName = createElement("h3", ["list-item__name", "list-item__name--small"], {}, item.name);
      itemPrice = createElement("h3", ["list-item__price", "list-item__price--small"], {}, `${item.price} SEK`);
      itemInfo = createElement("h4", ["list-item__info", "list-item__info--small"], {}, `Antal: ${item.quantity || 1}`);
      break;
  }

  const dottedLine = createElement("hr", ["list-item__hr"], {});
  const dottedLineDivider = createElement("hr", ["list-item__hr", "list-item__hr--divider"], {});

  appendChildren(rowOne, itemName, dottedLine, itemPrice);
  appendChildren(rowTwo, itemInfo);
  if (mode === "menu") {
    appendChildren(rowTwo, quantityButton);
    appendChildren(listItem, rowOne, rowTwo, dottedLineDivider);
  } else {
    appendChildren(listItem, rowOne, rowTwo);
  }

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

//style utilities

export function styleElement(element, property, value) {
  element.style[property] = value;
}
