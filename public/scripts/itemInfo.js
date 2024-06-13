const itemButtons = document.querySelectorAll(".choose");

const createItemInfoSection = async (itemData) => {
  let elementToRemove = document.querySelector(".temp");
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove);
  }
  let item = itemData.item[0];

  let sum = 0;
  let count = 1;
  if (itemData.reviews.length > 0) {
    for (const review of itemData.reviews) {
      sum += review.rating;
    }
    count = itemData.reviews.length;
  }
  let averageRating = Math.round(sum / count);

  const animationItemPlace = document.querySelector(".animation-item-place");
  let newItemHTML = `
        <div class="item temp" id="item">
          <img src="${item.image}" alt="${item.item_name}" class="item-image"> 
          <div class="info-table">
            <div class="item-name">
              <h4 id="item-name">
                ${item.item_name} 
              </h4>
            </div>
            <div class="item-cost-list">
              <div class="price-block">
                <p>Current price</p>
                <h4 id="item-cost">
                  ${item.price} $
                </h4>
              </div>
              <ul id="list-info" style="list-style: none; padding: 0;">
                <li>Age: ${item.age}</li>
                <li>Pieces: ${item.piece_count}</li>
                <li>LEGO Points: 6S</li>
              </ul>
            </div>
            <div class="rating-set-icon">
              <p><img src="/assets/full-star.png" alt="star" style="max-width: 20px;
              display: flex; align-items: center; justify-content:center"/>
              ${averageRating}</p>
              <p id="set-icon">${item.name}</p>
            </div>
          </div>
          <a href="/shop/${item.id}/details" id="add-to-cart-btn" style="text-decoration: none">Go to item page</a>
        </div>
      `;
  animationItemPlace.innerHTML = newItemHTML;
};

itemButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    try {
      const id = event.currentTarget.dataset.item_id;
      // console.log(id);
      const response = await fetch(`/home/${id}`);
      if (response.ok) {
        const itemData = await response.json();
        // console.table(itemData);
        createItemInfoSection(itemData);
      } else {
        alert("Error in getting item info");
      }
    } catch (error) {
      alert(error.message);
    }
  });
});
