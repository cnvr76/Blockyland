const allQuantityInputs = document.querySelectorAll(".quantity-selector input");
const totalP = document.getElementById("total-p");
const cartItems = document.querySelectorAll(".quantity-selector");
const priceTags = document.querySelectorAll(".price-tag");
const totalSum = document.getElementById("total-sum");
const saveQuantity = document.querySelectorAll(".save-quantity");

saveQuantity.forEach((button) => {
  button.addEventListener("click", (event) => {
    const quantityInput = button
      .closest(".quantity-selector")
      .querySelector(".product-quantity");
    const quantity = quantityInput.value;
    const itemId = event.currentTarget.dataset.item_id;

    // console.log(`Item ID: ${itemId}, Quantity: ${quantity}`);
    window.location.href = `/cart/${itemId}/${quantity}/update`;
  });
});

const updateTotalQuantity = () => {
  let total = 0;
  allQuantityInputs.forEach((input) => {
    let q = input.getAttribute("value");
    total += parseInt(q);
  });
  totalP.textContent = `Total item amount: ${total} items`;
};

const updateTotalPrice = () => {
  let totalAmount = 0;
  let totalPrice = 0;

  allQuantityInputs.forEach((input, index) => {
    let amount = parseInt(input.value);
    let price = parseFloat(priceTags[index].dataset.price);
    totalAmount += amount;
    totalPrice += amount * price;
  });

  totalSum.innerHTML = `Total: <u>${totalPrice} $</u>`;
};

cartItems.forEach((item) => {
  const decreaseButton = item.querySelector(".decrease-quantity");
  const increaseButton = item.querySelector(".increase-quantity");
  const quantityInput = item.querySelector(".product-quantity");

  decreaseButton.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > parseInt(quantityInput.min)) {
      quantityInput.value = currentValue - 1;
      quantityInput.setAttribute("value", quantityInput.value);
    }
    updateTotalQuantity();
    updateTotalPrice();
  });

  increaseButton.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < parseInt(quantityInput.max)) {
      quantityInput.value = currentValue + 1;
      quantityInput.setAttribute("value", quantityInput.value);
    }
    updateTotalQuantity();
    updateTotalPrice();
  });
});

window.onload = (event) => updateTotalQuantity();
