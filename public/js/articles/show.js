(function () {
  const buttonApperance = () => {
    // extract all quiz
    const formQuiz = Array.from(document.querySelectorAll(".form-quiz"));
    // extract forms elements
    if (formQuiz.length) {
      const formQuizElements = formQuiz.map((form) =>
        Array.from(form.elements)
      );
      // differentiating elements according their tagName
      const formattedFormQuizElement = formQuizElements.map((elements) => {
        const button = elements.find((element) => element.tagName === "BUTTON");
        const inputs = elements.filter(
          (element) => element.tagName === "INPUT"
        );
        return {
          button,
          inputs,
          elements,
        };
      });

      // extracting question per formQuiz as an array of array
      const formQuizQuestion = formQuiz.map((form) =>
        Array.from(form.children).filter((child) =>
          child.classList.contains("question")
        )
      );
      // associating related element form quiz => questions => each question => inputs => related button
      const formQuizQuestionElements = formQuizQuestion.map(
        (quizQuestion, indexQuestion) => {
          const inputs = quizQuestion.map((quizQuestion) =>
            Array.from(quizQuestion.children).filter(
              (element) => element.tagName === "INPUT"
            )
          );
          return {
            inputs,
            quizQuestion,
            relatedButton: formattedFormQuizElement[indexQuestion].button,
          };
        }
      );

      // styles
      const classList = ["disabled"];

      formQuizQuestionElements.forEach(
        ({ inputs, relatedButton, quizQuestion }) => {
          let atLeastAnInputIsCheckedPerQuestion = true;
          quizQuestion.forEach((question, index) => {
            const relatedInputs = inputs[index];
            const isAnInputChecked = relatedInputs.find(
              (input) => input.checked
            )
              ? true
              : false;
            atLeastAnInputIsCheckedPerQuestion =
              atLeastAnInputIsCheckedPerQuestion && isAnInputChecked;
          });
          if (atLeastAnInputIsCheckedPerQuestion) {
            relatedButton && relatedButton.classList.remove(...classList);
          } else {
            relatedButton && relatedButton.classList.add(...classList);
          }
        }
      );
    }
  };

  const panelRadioAppearance = () => {
    const panelRadio = Array.from(document.querySelectorAll(".panel-radio"));
    panelRadio.forEach((panel) => {
      panel.addEventListener("click", function (event) {
        event.preventDefault();
        const { currentTarget } = event;
        const input = currentTarget.previousElementSibling;
        input.checked = true;
        input.click(); /** event to trigger button Appearance change */
      });
    });
  };

  const formQuizInputs = Array.from(
    document.querySelectorAll(".form-quiz input")
  );

  formQuizInputs.forEach((input) =>
    input.addEventListener("click", function (event) {
      buttonApperance();
    })
  );

  document.addEventListener("DOMContentLoaded", function (event) {
    panelRadioAppearance();
    buttonApperance();
  });
})();
