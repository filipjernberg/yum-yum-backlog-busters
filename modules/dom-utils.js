export function createElement(tag, classNames = [], attributes = {}, textContent = ``) {
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

export function removeClass(element, className) {
  element.classList.remove(className);
}

export function addClass(element, className) {
  element.classList.add(className);
}

export function getElement(selector) {
  return document.querySelector(selector);
}

export function getElements(selector) {
  return document.querySelectorAll(selector);
}
