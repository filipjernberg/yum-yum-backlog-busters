import { getElement, styleElement, addClasses, removeClasses } from "./domUtils.js";
import { comparePasswords } from "./utils.js";

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
export async function validateLogin(username, password, allUsers) {
  let errors = [];
  console.log(`All users: `, allUsers);
  const user = allUsers.find((user) => user.username === username);

  if (!user) {
    errors.push(`Användarnamnet finns inte`);
  } else {
    if (user.password) {
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        errors.push(`Fel lösenord`);
      }
    } else {
      errors.push(`Användaren har inte sparat ett lösenord.`);
    }
  }
  return errors;
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
