import { getElement, styleElement, addClasses, removeClasses } from "./domUtils.js";
import { comparePasswords } from "./utils.js";
import { fetchUsers } from "./api.js";
import { getUsers, saveCurrentUser } from "./users.js";

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
