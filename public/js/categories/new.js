import { isNotEmpty } from '../lib/validators.js';

document.addEventListener("DOMContentLoaded", function () {
  const validateHTMLElement = (htmlElement, isValid, errors) => {
    const errorsClasses = ["border-2", "border-danger"];
    if (isValid) {
      const parentNode = htmlElement.parentNode;
      const children = Array.from(parentNode.children);
      const currentErrorSpan = children.find((htmlElement) =>
        htmlElement.classList.contains("errors")
      );
      if (currentErrorSpan) {
        currentErrorSpan.innerHTML = "";
        htmlElement.classList.remove(...errorsClasses);
      }
    } else {
      const parentNode = htmlElement.parentNode;
      const children = Array.from(parentNode.children);
      const currentErrorSpan = children.find((htmlElement) =>
        htmlElement.classList.contains("errors")
      );
      if (currentErrorSpan) {
        currentErrorSpan.innerHTML = "";
        htmlElement.classList.add(...errorsClasses);
        const text = document.createTextNode(errors.join(", "));
        currentErrorSpan.appendChild(text);
      }
    }
  };

  const validateFieldsOnLoad = () => {
    const allInputs = Array.from(document.querySelectorAll("input"));
    allInputs.forEach((element) => {
      const { value } = element;
      const { isValid, errors } = isNotEmpty(value);
      validateHTMLElement(element, isValid, errors);
    });
  };
  const validateFieldsOnInput = () => {
    const onInput = () =>
      window.addEventListener("input", function (event) {
        const { target } = event;
        if (target.tagName === "INPUT") {
          const { value } = target;
          const { isValid, errors } = isNotEmpty(value);
          validateHTMLElement(target, isValid, errors);
          formIsValid();
        }
      });
    window.removeEventListener("input", onInput);
    onInput();
  };

  validateFieldsOnLoad()
  validateFieldsOnInput()
});
