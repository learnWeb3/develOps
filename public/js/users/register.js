import {
  isValidEmail,
  isValidPassword,
  isSameAs,
  isValidUsername,
} from "../lib/validators.js";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[name='email']");
    const emailErrorsSpan = document.querySelector(".errors[data-for='email']");
    const passwordInput = document.querySelector("input[name='password']");
    const passwordErrorsSpan = document.querySelector(
      ".errors[data-for='password']"
    );
    const passwordConfirmationInput = document.querySelector(
      "input[name='password_confirmation']"
    );
    const passwordConfirmationErrorsSpan = document.querySelector(
      ".errors[data-for='password_confirmation']"
    );
    const usernameInput = document.querySelector("input[name='username']");
    const usernameErrorsSpan = document.querySelector(
      ".errors[data-for='username']"
    );
    const submitButton = document.querySelector(
      'form#register button[type="submit"]'
    );

    const errorsClasses = ["border-2", "border-danger"];

    const validateUsername = (usernameInput, usernameErrorsSpan, value) => {
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
      return isValid;
    };

    const validateEmail = (emailInput, emailErrorsSpan, value) => {
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
      return isValid;
    };

    const validatePassword = (passwordInput, passwordErrorsSpan, value) => {
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
      return isValid;
    };

    const validatePasswordConfirmation = (
      passwordConfirmationInput,
      passwordConfirmationErrorsSpan,
      value
    ) => {
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
      return isValid;
    };

    // listnen inputs events
    usernameInput.addEventListener("input", (event) => {
      const checkUsername = validateUsername(
        usernameInput,
        usernameErrorsSpan,
        usernameInput.value
      );
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
      const checkPasswordConfirmation = validatePasswordConfirmation(
        passwordConfirmationInput,
        passwordConfirmationErrorsSpan,
        passwordConfirmationInput.value
      );

      if (
        checkUsername &&
        checkEmail &&
        checkPassword &&
        checkPasswordConfirmation
      ) {
        submitButton.classList.remove("disabled");
      } else {
        submitButton.classList.add("disabled");
      }
    });

    emailInput.addEventListener("input", (event) => {
      const checkUsername = validateUsername(
        usernameInput,
        usernameErrorsSpan,
        usernameInput.value
      );
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
      const checkPasswordConfirmation = validatePasswordConfirmation(
        passwordConfirmationInput,
        passwordConfirmationErrorsSpan,
        passwordConfirmationInput.value
      );

      if (
        checkUsername &&
        checkEmail &&
        checkPassword &&
        checkPasswordConfirmation
      ) {
        submitButton.classList.remove("disabled");
      } else {
        submitButton.classList.add("disabled");
      }
    });

    passwordInput.addEventListener("input", (event) => {
      const checkUsername = validateUsername(
        usernameInput,
        usernameErrorsSpan,
        usernameInput.value
      );
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
      const checkPasswordConfirmation = validatePasswordConfirmation(
        passwordConfirmationInput,
        passwordConfirmationErrorsSpan,
        passwordConfirmationInput.value
      );

      if (
        checkUsername &&
        checkEmail &&
        checkPassword &&
        checkPasswordConfirmation
      ) {
        submitButton.classList.remove("disabled");
      } else {
        submitButton.classList.add("disabled");
      }
    });

    passwordConfirmationInput.addEventListener("input", (event) => {
      const checkUsername = validateUsername(
        usernameInput,
        usernameErrorsSpan,
        usernameInput.value
      );
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
      const checkPasswordConfirmation = validatePasswordConfirmation(
        passwordConfirmationInput,
        passwordConfirmationErrorsSpan,
        passwordConfirmationInput.value
      );
      if (
        checkUsername &&
        checkEmail &&
        checkPassword &&
        checkPasswordConfirmation
      ) {
        submitButton.classList.remove("disabled");
      } else {
        submitButton.classList.add("disabled");
      }
    });

    // onload
    const checkUsername = validateUsername(
      usernameInput,
      usernameErrorsSpan,
      usernameInput.value
    );
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
    const checkPasswordConfirmation = validatePasswordConfirmation(
      passwordConfirmationInput,
      passwordConfirmationErrorsSpan,
      passwordConfirmationInput.value
    );

    if (
      checkUsername &&
      checkEmail &&
      checkPassword &&
      checkPasswordConfirmation
    ) {
      submitButton.classList.remove("disabled");
    } else {
      submitButton.classList.add("disabled");
    }
  });
})();
