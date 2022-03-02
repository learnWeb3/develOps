import { isValidEmail, isValidPassword, isSameAs } from "../lib/validators.js";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[name='email']");
    const emailErrorsSpan = document.querySelector(".errors[data-for='email']");
    const passwordInput = document.querySelector("input[name='password']");
    const passwordErrorsSpan = document.querySelector(
      ".errors[data-for='password']"
    );
    const errorsClasses = ["border-2", "border-danger"];
    const submitButton = document.querySelector(
      'form#login button[type="submit"]'
    );

    const validateEmail = (emailInput, emailErrorsSpan, value) => {
      const { isValid, errors } = isValidEmail(value);
      if (isValid) {
        emailInput.classList.remove(...errorsClasses);
        emailErrorsSpan.innerHTML = "";
        return true;
      } else {
        emailErrorsSpan.innerHTML = "";
        emailInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        emailErrorsSpan.appendChild(textNode);
        return false;
      }
    };

    const validatePassword = (passwordInput, passwordErrorsSpan, value) => {
      const { isValid, errors } = isValidPassword(value);
      if (isValid) {
        passwordInput.classList.remove(...errorsClasses);
        passwordErrorsSpan.innerHTML = "";
        return true;
      } else {
        passwordErrorsSpan.innerHTML = "";
        passwordInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        passwordErrorsSpan.appendChild(textNode);
        return false;
      }
    };

    emailInput.addEventListener("input", (event) => {
      const checkPassword = validatePassword(
        passwordInput,
        passwordErrorsSpan,
        passwordInput.value
      );
      const checkEmail = validateEmail(
        emailInput,
        emailErrorsSpan,
        emailInput.value
      );
      if (checkEmail && checkPassword) {
        submitButton.classList.remove("disabled");
      } else {
        submitButton.classList.add("disabled");
      }
    });

    passwordInput.addEventListener("input", (event) => {
      const checkPassword = validatePassword(
        passwordInput,
        passwordErrorsSpan,
        passwordInput.value
      );
      const checkEmail = validateEmail(
        emailInput,
        emailErrorsSpan,
        emailInput.value
      );
      if (checkEmail && checkPassword) {
        submitButton.classList.remove("disabled");
      } else {
        submitButton.classList.add("disabled");
      }
    });

    const checkEmail = validateEmail(
      emailInput,
      emailErrorsSpan,
      emailInput.value
    );
    const checkPassword = validatePassword(
      passwordInput,
      passwordErrorsSpan,
      passwordInput.value
    );
    if (checkEmail && checkPassword) {
      submitButton.classList.remove("disabled");
    } else {
      submitButton.classList.add("disabled");
    }
  });
})();
