const changeImageButtons = document.querySelectorAll(".ChImage");
const mainPhoto = document.getElementById("main-photo");

const quantity_input = document.querySelector(".quantity-selector input");
const buy_button = document.querySelector(".buy-button");

changeImageButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    let img = event.currentTarget.dataset.url;
    mainPhoto.setAttribute("src", img);
  });
});

buy_button.addEventListener("click", () => {
  let quantity = parseInt(quantity_input.getAttribute("value"));
  let item_id = buy_button.dataset.item_id;

  window.location.href = `/cart/${item_id}/${quantity}/add`;
});

const changeQuantity = (change) => {
  let currentQuantity = parseInt(quantity_input.getAttribute("value"));
  let newQuantity = currentQuantity + change;

  if (newQuantity > 0) {
    quantity_input.setAttribute("value", newQuantity);
    quantity_input.value = newQuantity;
  }
};
