(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const searchbar = document.querySelector("#searchbar");
    if (searchbar) {
      const { offsetTop } = searchbar;
      window.addEventListener("scroll", function (event) {
        const { scrollY } = window;
        if (scrollY >= offsetTop) {
          searchbar.classList.add("sticky-top");
        } else {
          searchbar.classList.remove("sticky-top");
        }
      });
    } else {
      console.log(`search bar is currently ${searchbar}`);
    }
  });
})();
