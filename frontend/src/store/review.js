const LOAD_REVIEW_Id = "reviews/LOAD_REVIEWS_Id";

const loadReviewId = (reviews) => ({
  type: LOAD_REVIEW_Id,
  reviews,
});

export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  const reviews = await res.json();
  if (res.ok) {
    dispatch(loadReviewId(reviews));
  } else {
    console.log("$%");
  }
};

const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_REVIEW_Id:
      return { ...state, reviews: action.reviews };
      default:
        return state
  }
};

export default reviewReducer
