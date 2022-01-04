import './css/index.css';
import PentaSelect from './js/PentaSelect';
import PentaInputRange from './js/PentaInputRange';

document.addEventListener("keyup", (e) => {
  if (e.code === "Tab") {
    document.body.classList.add("with-a11y");
  }
});

/* for presentation only */

let elts = document.querySelectorAll('p')
elts.forEach((elt) => {
  let container = document.createElement('div')
  container.classList.add('code-container')
  let code = document.createElement('code')
  code.innerText = elt.innerHTML.trim()

  container.append(code)
  elt.before(container)
})

/* selectors */
document.querySelectorAll('select[data-penta-select]').forEach((elt) => {
  new PentaSelect(elt)
})

document.querySelectorAll('input[data-penta-range]').forEach((elt) => {
  new PentaInputRange(elt)
})