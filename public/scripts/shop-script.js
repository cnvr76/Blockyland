const buttons = document.querySelectorAll(".choose");

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    let id = event.currentTarget.dataset.item_id;
    window.location.href = `/shop/${id}/details`;
  });
});

// Turning on/off filters
document.getElementById("show-type-btn").addEventListener("click", () => {
  const hiddenOptions = document.getElementById("product-type-hidden");
  const icon = document.querySelector(".dropdown");

  if (window.getComputedStyle(hiddenOptions).display === "none") {
    hiddenOptions.style.display = "block";
    icon.classList.add("upside-down");
  } else {
    hiddenOptions.style.display = "none";
    icon.classList.remove("upside-down");
  }
});

let menuIconBtn = document.getElementById("menu-icon");
let wrapper = document.querySelector(".library");
let filterCol = document.getElementById("filters");

if (window.innerWidth < 1210) {
  wrapper.classList.remove("filter-shown");
}

menuIconBtn.addEventListener("click", () => {
  if (window.getComputedStyle(filterCol).display === "none") {
    filterCol.style.display = "block";
    wrapper.classList.add("filter-shown");
  } else {
    filterCol.style.display = "none";
    wrapper.classList.remove("filter-shown");
  }
});
