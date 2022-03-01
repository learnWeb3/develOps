import { isValidEmail, isValidPassword, isSameAs, isValidUsername } from "../lib/validators.js";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[name='email']");
    const emailErrorsSpan = document.querySelector(".errors[data-for='email']");
    const passwordInput = document.querySelector("input[name='password']");
    const passwordErrorsSpan = document.querySelector(
      ".errors[data-for='password']"
    );
    const passwordConfirmationInput = document.querySelector(
      "input[name='password-confirmation']"
    );
    const passwordConfirmationErrorsSpan = document.querySelector(
      ".errors[data-for='password-confirmation']"
    );
    const usernameInput = document.querySelector("input[name='username']");
    const usernameErrorsSpan = document.querySelector(
      ".errors[data-for='username']"
    );

    const errorsClasses = ["border-2", "border-danger"];

    usernameInput.addEventListener("input", (event) => {
      const {
        currentTarget: { value },
      } = event;
      const { isValid, errors } = isValidUsername(value);
      if (isValid) {
        usernameInput.classList.remove(...errorsClasses);
        usernameErrorsSpan.innerHTML = "";
      } else {
        usernameErrorsSpan.innerHTML = "";
        usernameInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        usernameErrorsSpan.appendChild(textNode);
      }
    });

    emailInput.addEventListener("input", (event) => {
      const {
        currentTarget: { value },
      } = event;
      const { isValid, errors } = isValidEmail(value);
      if (isValid) {
        emailInput.classList.remove(...errorsClasses);
        emailErrorsSpan.innerHTML = "";
      } else {
        emailErrorsSpan.innerHTML = "";
        emailInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        emailErrorsSpan.appendChild(textNode);
      }
    });

    passwordInput.addEventListener("input", (event) => {
      const {
        currentTarget: { value },
      } = event;
      const { isValid, errors } = isValidPassword(value);
      if (isValid) {
        passwordInput.classList.remove(...errorsClasses);
        passwordErrorsSpan.innerHTML = "";
      } else {
        passwordErrorsSpan.innerHTML = "";
        passwordInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        passwordErrorsSpan.appendChild(textNode);
      }
    });

    passwordConfirmationInput.addEventListener("input", (event) => {
      const {
        currentTarget: { value },
      } = event;
      const { isValid, errors } = isSameAs(
        value,
        passwordInput.value,
        "password"
      );
      if (isValid) {
        passwordConfirmationInput.classList.remove(...errorsClasses);
        passwordConfirmationErrorsSpan.innerHTML = "";
      } else {
        passwordConfirmationErrorsSpan.innerHTML = "";
        passwordConfirmationInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        passwordConfirmationErrorsSpan.appendChild(textNode);
      }
    });
  });
})();
