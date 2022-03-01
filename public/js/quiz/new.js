(function () {
  const AnswerUi = (index) => {
    const rootDiv = document.createElement("div");
    rootDiv.setAttribute("class", "mb-3");
    rootDiv.innerHTML = ` <label class="form-label" for="answer-${index}">Answer n°${index}</label>
      <input type="text" name="answer-${index}" class="form-control">`;
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
                <label class="form-label fw-bolder" for="">Write the question</label>
                <input type="text" class="form-control">
            </div>

            <p class="fw-bolder">Available answers</p>

            <p class="mb-3 text-muted text-sm">
                The available answers are the all the choices from which one can pick in order to answer the quiz.
            </p>

            <div class="w-100 available-answers">
                <div class="mb-3">
                    <label class="form-label" for="">Answer n°1</label>
                    <input type="text" class="form-control">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-12 col-lg-6 d-flex align-items-center justify-content-lg-start">
                    <button class="btn btn-sm btn-primary col-12 col-lg-4 my-2" data-action="add"
                        data-type="answer">
                        ADD ANSWER
                    </button>
                </div>
                <div class="col-12 col-lg-6 d-flex align-items-center justify-content-lg-end">
                    <button class="btn btn-sm btn-danger col-12 col-lg-4 my-2" data-action="remove"
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
                <label class="form-label" for="">Select the correct answer for the quiz</label>
                <select class="form-select" aria-label="Default select example">
                    <option selected>Link your quiz to an article</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
            </div>`;

    return rootDiv;
  };

  document.addEventListener("DOMContentLoaded", function () {
    const clickEventListener = () =>
      window.addEventListener("click", function (event) {
        const { target } = event;
        const addButtons = Array.from(
          document.querySelectorAll('button[data-action="add"]')
        );
        const removeButtons = Array.from(
          document.querySelectorAll('button[data-action="remove"]')
        );

        const availableQuestionContainer = document.querySelector(
          "#available-questions"
        );
        const availableAnswerContainers = Array.from(
          document.querySelectorAll(".available-answers")
        );

        if (addButtons.includes(target)) {
          event.preventDefault();
          const availableAnswerContainer = availableAnswerContainers.find(
            (element) => element.parentNode.contains(target)
          );

          if (target.dataset.type === "question") {
            const currentQuestionNumber = Array.from(
              availableQuestionContainer.children
            ).length;
            const newQuestionUI = QuestionUi(currentQuestionNumber + 1);
            availableQuestionContainer.appendChild(newQuestionUI);
          }

          if (target.dataset.type === "answer") {
            const currentAnswerNumber = Array.from(
              availableAnswerContainer.children
            ).length;
            const newAnswerUI = AnswerUi(currentAnswerNumber + 1);
            availableAnswerContainer.appendChild(newAnswerUI);
          }
        }

        if (removeButtons.includes(target)) {
          event.preventDefault();
          const availableAnswerContainer = availableAnswerContainers.find(
            (element) => element.parentNode.contains(target)
          );

          if (target.dataset.type === "answer") {
            const currentAnswersUi = Array.from(
              availableAnswerContainer.children
            );
            currentAnswersUi[currentAnswersUi.length - 1].remove();
          }

          if (target.dataset.type === "question") {
            const currentQuestionsUi = Array.from(
              availableQuestionContainer.children
            );
            currentQuestionsUi[currentQuestionsUi.length - 1].remove();
          }
        }
      });

    clickEventListener();
  });
})();
