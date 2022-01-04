let months = ["Jan", "Fev", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export function formatDate(date) {
  let min = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getHours()}h${min}`;
}
