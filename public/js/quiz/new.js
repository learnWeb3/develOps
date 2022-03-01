import { isNotEmpty } from "../lib/validators.js";

(function () {
  const AnswerUi = (questionIndex, index) => {
    const rootDiv = document.createElement("div");
    rootDiv.setAttribute("class", "mb-3");
    rootDiv.innerHTML = ` <label class="form-label" for="question-${questionIndex}-answer-${index}">Answer n°${index}</label>
      <input type="text" id="question-${questionIndex}-answer-${index}" name="questions[answers[content]]" class="form-control mb-1">
      <span data-validate="required" class="errors text-danger py-2"></span>`;
    return rootDiv;
  };

  const QuestionUi = (index) => {
    const rootDiv = document.createElement("div");
    rootDiv.setAttribute("class", "card p-4 mb-3");
    rootDiv.innerHTML = `
            <p class="fs-5 fw-bolder">Question n°${index}</p>

            <p class="mb-3 text-muted text-sm">
                Your question must imply a valid answer picked up among multiple choices displayed on the screen of
                your article.
            </p>

            <p class="mb-3 text-muted">The quiz intent is to help the user focus on the main topics of your article
                by highlighting essential understandings and takeovers from the reading.</p>

            <div class="mb-3">
                <label class="form-label fw-bolder" for="question-${index}-content">Write the question</label>
                <input type="text" id="question-${index}-content" name="questions[content]" class="form-control mb-1">
                <span data-validate="required" class="errors text-danger py-2"></span>
            </div>

            <p class="fw-bolder">Available answers</p>

            <p class="mb-3 text-muted text-sm">
                The available answers are the all the choices from which one can pick in order to answer the quiz.
            </p>

            <div class="w-100 available-answers">
                <div class="mb-3">
                    <label class="form-label" for="question-${index}-answer-1">Answer n°1</label>
                    <input type="text" id="question-${index}-answer-1" name="questions[answers[content]]" class="form-control mb-1">
                    <span data-validate="required" class="errors text-danger py-2"></span>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-12 col-lg-6 d-flex align-items-center justify-content-lg-start">
                    <button class="btn btn-sm btn-primary col-12 col-lg-4 my-2 disabled" data-action="add"
                        data-type="answer">
                        ADD ANSWER
                    </button>
                </div>
                <div class="col-12 col-lg-6 d-flex align-items-center justify-content-lg-end">
                    <button class="btn btn-sm btn-danger col-12 col-lg-4 my-2 disabled" data-action="remove"
                        data-type="answer">
                        REMOVE ANSWER
                    </button>
                </div>
            </div>
            <p class="fw-bolder">Validate the correct answer</p>
            <p class="mb-3 text-muted text-sm">
                In this section, you must select the valid answer for your quiz.
            </p>
            <div class="mb-3">
                <label class="form-label" for="question-${index}-valid-answer">Select the correct answer for the quiz</label>
                <select id="question-${index}-valid-answer" name="questions[valid_answer_id]" class="form-select" aria-label="Default select example">
                    <option selected>Choose the valid answer among the one you've set up</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
            </div>`;

    return rootDiv;
  };

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
      window.addEventListener("input", function (event) {
        const { target } = event;
        if (target.tagName === "INPUT") {
          const { value } = target;
          const { isValid, errors } = isNotEmpty(value);
          validateHTMLElement(target, isValid, errors);
        }
      });
    };
    const clickEventListener = () =>
      window.addEventListener("click", function (event) {
        // ref element clicked
        const { target } = event;
        // add operation triggers
        const addButtons = Array.from(
          document.querySelectorAll('button[data-action="add"]')
        );
        // remove operation triggers
        const removeButtons = Array.from(
          document.querySelectorAll('button[data-action="remove"]')
        );
        // parent element containing questions
        const availableQuestionContainer = document.querySelector(
          "#available-questions"
        );
        // all answers container
        const availableAnswerContainers = Array.from(
          document.querySelectorAll(".available-answers")
        );

        // click add operation defined by data-action attribute
        if (addButtons.includes(target)) {
          event.preventDefault();
          // find currently targeted answer container
          const availableAnswerContainer = availableAnswerContainers.find(
            (element) => element.parentNode.contains(target)
          );
          // find currently targeted answer container index
          const availableAnswerContainerIndex =
            availableAnswerContainers.findIndex(
              (element) => element === availableAnswerContainer
            );

          // question related operation depends on data-type='question' attribute
          if (target.dataset.type === "question") {
            const currentQuestionNumber = Array.from(
              availableQuestionContainer.children
            ).length;
            const newQuestionUI = QuestionUi(currentQuestionNumber + 1);
            availableQuestionContainer.appendChild(newQuestionUI);
          }

          // answer related operation depends on data-type='answer' attribute
          if (target.dataset.type === "answer") {
            const currentAnswerNumber = Array.from(
              availableAnswerContainer.children
            ).length;
            const newAnswerUI = AnswerUi(
              availableAnswerContainerIndex + 1,
              currentAnswerNumber + 1
            );
            availableAnswerContainer.appendChild(newAnswerUI);
          }

          validateFieldsOnLoad();
          validateFieldsOnInput();
        }

        // click remove operation defined by data-action attribute
        if (removeButtons.includes(target)) {
          event.preventDefault();

          // currently targeted answer container
          const availableAnswerContainer = availableAnswerContainers.find(
            (element) => element.parentNode.contains(target)
          );

          // answer related operation depends on data-type='answer' attribute
          if (target.dataset.type === "answer") {
            const currentAnswersUi = Array.from(
              availableAnswerContainer.children
            );
            currentAnswersUi[currentAnswersUi.length - 1].remove();
          }

          // question related operation depends on data-type='question' attribute
          if (target.dataset.type === "question") {
            const currentQuestionsUi = Array.from(
              availableQuestionContainer.children
            );
            currentQuestionsUi[currentQuestionsUi.length - 1].remove();
          }

          validateFieldsOnLoad();
          validateFieldsOnInput();
        }
      });

    validateFieldsOnLoad();
    clickEventListener();
    validateFieldsOnInput();
  });
})();
