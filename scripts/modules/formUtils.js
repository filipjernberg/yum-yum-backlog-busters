import { getElement, styleElement, addClasses, removeClasses } from "./domUtils.js";
import { comparePasswords } from "./utils.js";
import { fetchUsers } from "./api.js";
import { getFromLocalStorage, setLocalStorage } from "./localStorageUtils.js";

export function handleRegistrationForm() {
  const registrationWrapperRef = getElement(`#wrapperRegister`);
  const wrapperguestRef = getElement(`#wrapperGuest`);

  removeClasses(registrationWrapperRef, [`d-none`]);
  addClasses(registrationWrapperRef, [`flex`]);

  addClasses(wrapperguestRef, [`d-none`]);
  removeClasses(wrapperguestRef, [`flex`]);
}

export function validateUserInput(username, email, password, confirmPassword, allUsers) {
  let errors = [];
  console.log(`All users: `, allUsers);

  if (allUsers.some((user) => user.username === username)) {
    errors.push(`Användarnamnet är upptaget.`);
  }
  if (allUsers.some((user) => user.email === email)) {
    errors.push(`Mejladressen är redan registrerad.`);
  }
  if (!email.includes("@")) {
    errors.push(`Mejladressen måste innehålla ett @.`);
  }
  if (password.length < 6) {
    errors.push(`Lösenordet måste vara minst 6 tecken.`);
  }
  if (password !== confirmPassword) {
    errors.push(`Lösenorden matchar inte. Försök igen.`);
  }

  return errors;
}

//validering av login
export async function validateLogin(username, password) {
  let errors = [];

  const usersFromAPI = await fetchUsers(); // Hämta från API
  const userFromAPI = usersFromAPI.find((user) => user.username === username);

  const usersFromLocalStorage = getUsers();
  const allUsersLocalStorage = usersFromLocalStorage.allUsers || [];
  const userFromLocalStorage = allUsersLocalStorage.find((user) => user.username === username);

  if (!userFromAPI && !userFromLocalStorage) {
    errors.push("Användarnamnet är inte registrerat.");
    console.log("Användarnamnet finns inte i API eller LocalStorage.");
    return errors; // Avbryt validering här om användaren inte existerar
  }

  if (userFromAPI) {
    if (userFromAPI.password !== password) {
      errors.push("Fel lösenord.");
      console.log("Fel lösenord från API.");
    } else {
      console.log("Inloggning lyckades från API!");
      saveCurrentUser(userFromAPI);
      return []; // Ingen anledning att fortsätta om lösenordet är korrekt
    }
  }
  if (userFromLocalStorage) {
    const passwordMatches = await comparePasswords(password, userFromLocalStorage.password);
    if (!passwordMatches) {
      errors.push("Fel lösenord.");
      console.log("Fel lösenord från LocalStorage.");
    } else {
      console.log("Inloggning lyckades från LocalStorage!");
      saveCurrentUser(userFromLocalStorage);
      return []; // Ingen anledning att fortsätta om lösenordet är korrekt
    }
  }
  console.log("Inloggning misslyckades.");
  return errors; // Återvänd med felmeddelanden
}

//Skriver ut felmeddelande errormessages är div, errors är själva felet
export function displayErrorMessages(errorMessages, errors) {
  errorMessages.innerHTML = errors.map((error) => `<p>${error}</p>`).join("");
}

//Lyckas man komma igenom registrering så kommer en grön text upp som bekräftelse ovanför länken "logga in"
export function displaySuccessMessage() {
  const congrats = getElement(`#changeParagraph`);
  styleElement(congrats, `color`, `green`);
  congrats.textContent = `Du har nu skapat ett konto!`;
}

export function saveCurrentUser(user) {
  let usersData = getUsers();

  usersData.currentUser = user;

  usersData.allUsers = usersData.allUsers.map((u) => (u.username === user.username ? user : u));

  saveUsers(usersData);

  console.log(`Current user '${user.username}' har sparats.`);
}

export function updateCurrentUser(updateduser) {
  let users = getUsers();

  // Uppdatera `allUsers`
  users.allUsers = users.allUsers.map((user) => (user.username === updatedUser.username ? updatedUser : user));

  // Uppdatera `currentUser`
  users.currentUser = updatedUser;

  saveUsers(users);
}

export function containerBasedOnRole() {
  const usersData = getUsers();
  const currentUser = usersData.currentUser;

  if (currentUser) {
    removeClasses(getElement(`#wrapperGuest`), [`flex`]);
    addClasses(getElement(`#wrapperGuest`), [`d-none`]);
    if (currentUser.role === `admin`) {
      addClasses(getElement(`#wrapperAdmin`), [`flex`]);
      removeClasses(getElement(`#wrapperAdmin`), [`d-none`]);
      console.log("role: admin inloggad");
    } else {
      addClasses(getElement(`#wrapperProfile`), [`flex`]);
      removeClasses(getElement(`#wrapperProfile`), [`d-none`]);
      console.log("role: user inloggad");
    }
  } else {
    console.log("Inget inloggat användarkonto hittades.");
  }
}

export function logout() {
  let users = getUsers();
  users.currentUser = users.guest;
  saveUsers(users);
}

export function getUsers() {
  return (
    JSON.parse(localStorage.getItem("users")) || {
      allUsers: [],
      currentUser: null,
      guest: { username: "guest", role: "guest" },
    }
  );
}

export function saveUsers(data) {
  localStorage.setItem("users", JSON.stringify(data));
}

export function initializeUsers() {
  console.log(`startar upp users`);

  if (!localStorage.getItem("users")) {
    saveUsers({
      allUsers: [],
      currentUser: null,
      guest: { username: "guest", role: "guest" },
    });
  }
}
