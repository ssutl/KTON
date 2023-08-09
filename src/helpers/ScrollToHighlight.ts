import highlightStyles from "../styles/Components/Highlight.module.scss";

function scrollToElementWithText(text: string) {
  const container = document.getElementById("scrollHighlight");

  if (!container) {
    console.log("Container not found");
    return;
  }

  const elements = container.querySelectorAll("*");

  for (const element of elements) {
    if (element.textContent && element.textContent.includes(text)) {
      const parentElement = element.closest(`.${highlightStyles.Highlight}`);
      if (parentElement) {
        parentElement.classList.add(highlightStyles.activeCard);
        parentElement.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          parentElement.classList.remove(highlightStyles.activeCard);
        }, 3000);

        break;
      }
    }
  }
}

export default scrollToElementWithText;
