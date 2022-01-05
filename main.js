import "./css/index.css";
import PentaInputRange from "./js/PentaInputRange";
import PentaSelect from "./js/PentaSelect";

document.addEventListener("keyup", (e) => {
  if (e.code === "Tab") {
    document.body.classList.add("with-a11y");
  }
});

/* for presentation only */

let elts = document.querySelectorAll("p");
elts.forEach((elt) => {
  let container = document.createElement("div");
  container.classList.add("code-container");
  let code = document.createElement("code");
  code.innerText = elt.innerHTML.trim();

  container.append(code);
  elt.after(container);
});

document.querySelectorAll("input[data-penta-range]").forEach((elt) => {
  new PentaInputRange(elt);
});

document.querySelectorAll("select[data-penta-select-custom]").forEach((elt) => {
  new PentaSelect(elt);
});
