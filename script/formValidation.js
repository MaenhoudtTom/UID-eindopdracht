let email = {},
  keepMePostedButton;

// helper functies
const isValidEmailAddress = function (emailAddress) {
  // Basis manier om e-mailadres te checken.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function (fieldValue) {
  return !fieldValue || !fieldValue.length;
};

// functies
const getDOMElements = function () {
  email.errorMessage = document.querySelector(".js-email-error-message");
  email.input = document.querySelector(".js-email-input");
  email.field = document.querySelector(".js-email-field");
  keepMePostedButton = document.querySelector(".js-posted-button");
  // console.log(email);
  console.log(email.errorMessage);

  enableListeners();
};

const enableListeners = function () {
  email.input.addEventListener("blur", function () {
    if (isEmpty(email.input.value)) { /* && !isValidEmailAddress(email.input.value) */
      addErrors(email.field, email.errorMessage, "This field is required");
      email.input.addEventListener("input", doubleCheckEmailAdress);
    }
    else if (!isValidEmailAddress(email.input.value)) {
      email.input.addEventListener("input", doubleCheckEmailAdress);
    } 
    else if (!isEmpty(email.input.value)) {
      removeErrors(email.field, email.errorMessage);
      email.input.removeEventListener("input", doubleCheckEmailAdress);
    }
  });
};

const addErrors = function (formField, errorField, errorMessage) {
  formField.classList.add("has-error");
  console.log(errorField);
  errorField.style.display = "block";
  errorField.innerHTML = errorMessage;
  keepMePostedButton.disabled = true;
};

const removeErrors = function (formField, errorField) {
  formField.classList.remove("has-error");
  errorField.style.display = "none";
  keepMePostedButton.disabled = false;
};

const doubleCheckEmailAdress = function () {
  if (isValidEmailAddress(email.input.value)) { /* !isEmpty(email.input.value) && */
    removeErrors(email.field, email.errorMessage);
  } else {
    addErrors(email.field, email.errorMessage, "The email is incorrect");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  getDOMElements();
});
