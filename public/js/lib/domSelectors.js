export const getchildrenByClassName = (element, className) => {
  let results = [];
  if (className) {
    const children = Array.from(element.childNodes);
    const target = children.filter(
      (element) => element.classList && element.classList.contains(className)
    );
    if (!target) {
      for (let i = 0; i < children.length; i++) {
        const element = children[i];
        if (element.childElementCount > 0) {
          const check = getchildrenByClassName(element, className);
          if (check.length) {
            results = [...results, ...check];
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
      return results
    } else {
      return [...results, ...target];
    }
  }
};
