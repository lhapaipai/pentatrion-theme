import './css/index.css';

document.addEventListener("keyup", (e) => {
  if (e.code === "Tab") {
    document.body.classList.add("with-a11y");
  }
});
