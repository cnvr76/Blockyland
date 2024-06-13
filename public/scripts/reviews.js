const addReviewButton = document.querySelector(".form-container form");

const addReview = async (event) => {
  event.preventDefault();
  const newReview = {
    rating: event.target.rating.value,
    review: event.target.review.value,
  };
  const item_id = addReviewButton.dataset.item_id;
  const response = await fetch(`/shop/${item_id}/details/reviews`, {
    method: "post",
    body: JSON.stringify(newReview),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    // load reviews
    console.log("okkk");
    await loadReviews();
  }
};

const loadReviews = async () => {
  const item_id = addReviewButton.dataset.item_id;
  const response = await fetch(`/shop/${item_id}/details/show-reviews`);
  if (response.ok) {
    // console.log("okkkk");
    const reviews = await response.json();
    console.log(reviews);
  }
};

window.onload = async (event) => await loadReviews();
addReviewButton.addEventListener("submit", addReview);
