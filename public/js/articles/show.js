(function () {
  document.addEventListener("DOMContentLoaded", function (event) {
    const panelRadio = Array.from(document.querySelectorAll(".panel-radio"));

    panelRadio.forEach((panel) => {
      panel.addEventListener("click", function (event) {
        event.preventDefault();
        const { currentTarget } = event;
        const input = currentTarget.previousElementSibling
        input.checked = true;
      });
    });
  });
})();
