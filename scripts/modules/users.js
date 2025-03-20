import { getFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";
import { logout } from "./eventHandlers.js";
import { getElement, removeClasses, addClasses } from "./domUtils.js";

export function initializeUsers() {
  console.log(`startar upp users`);

  if (!localStorage.getItem("users")) {
    saveUsers({
      allUsers: [],
      currentUser: { username: "guest", role: "guest" },
      guest: { username: "guest", role: "guest" },
    });
  }
}
export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(data) {
  if (!data.allUsers) {
    data.allUsers = []; // Se till att allUsers finns
  }
  localStorage.setItem("users", JSON.stringify(data));
}

export function saveCurrentUser(user) {
  let usersData = getUsers();

  usersData.currentUser = user;

  usersData.allUsers = usersData.allUsers.map((u) => (u.username === user.username ? user : u));

  saveUsers(usersData);

  console.log(`Current user '${user.username}' har sparats.`);
}

export function updateCurrentUser(updatedUser) {
  let users = getUsers();

  // Uppdatera `allUsers`
  users.allUsers = users.allUsers.map((user) => (user.username === updatedUser.username ? updatedUser : user));

  // Uppdatera `currentUser`
  users.currentUser = updatedUser;

  saveUsers(users);
}

export function logoutToGuest() {
  let users = getUsers();
  users.currentUser = users.guest;
  saveUsers(users);
}

export function containerBasedOnRole() {
  const usersData = getUsers();
  const currentUser = usersData.currentUser || [];

  hideAllContainers();

  if (!currentUser) {
    console.log("Inget användarkonto hittades.");
    return;
  }

  let wrapperId;
  let welcomeText = `Hej ${currentUser.username}!`;

  switch (currentUser.role) {
    case `admin`:
      wrapperId = "#wrapperAdmin";
      console.log("role: admin inloggad");
      logout(`#logoutAdmin`);
      break;
    case `user`:
      wrapperId = "#wrapperProfile";
      console.log("role: user inloggad");
      logout(`#logoutUser`);
      break;
    case `guest`:
      wrapperId = "#wrapperGuest";
      welcomeText = "Välkommen gäst!";
      getElement("#loginPassword").value = "";
      console.log("role: guest");
      break;
  }

  showContainer(wrapperId);

  const titleElement = getElement("#changeAccountTitle");
  if (titleElement) titleElement.textContent = welcomeText;

  // Uppdatera profilnamn om det finns
  const profileTitle = getElement(".profile__title");
  if (profileTitle) profileTitle.textContent = currentUser.username;
}

export function hideAllContainers() {
  ["#wrapperGuest", "#wrapperProfile", "#wrapperAdmin"].forEach((id) => {
    showContainer(id, false);
  });
}

export function showContainer(selector, show = true) {
  const element = getElement(selector);
  if (!element) return;
  if (show) {
    addClasses(element, ["flex"]);
    removeClasses(element, ["d-none"]);
  } else {
    removeClasses(element, ["flex"]);
    addClasses(element, ["d-none"]);
  }
}
