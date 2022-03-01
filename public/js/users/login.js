import { isValidEmail, isValidPassword } from "../lib/validators.js";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[name='email']");
    const emailErrorsSpan = document.querySelector(".errors[data-for='email']");
    const passwordInput = document.querySelector("input[name='password']");
    const passwordErrorsSpan = document.querySelector(
      ".errors[data-for='password']"
    );
    const errorsClasses = ["border-2", "border-danger"];

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
        emailErrorsSpan.innerHTML = "";
        passwordInput.classList.add(...errorsClasses);
        const textNode = document.createTextNode(errors.join(", "));
        passwordErrorsSpan.appendChild(textNode);
      }
    });
  });
})();
