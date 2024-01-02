import { csrfFetch } from "./csrf";
const LOAD_REVIEW_Id = "reviews/LOAD_REVIEWS_Id";
const POST_REVIEW = "reviews/POST_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

const insertReview = (payload) => ({
  type: POST_REVIEW,
  payload,
});
const loadReviewId = (reviews) => ({
  type: LOAD_REVIEW_Id,
  reviews,
});

export const removeReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteReview(reviewId));
  } else {
    const err = await res.json();
    return err;
  }
};

export const postReview = (payload, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  dispatch(insertReview(data));
  return data;
};
export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  const reviews = await res.json();
  if (res.ok) {
    dispatch(loadReviewId(reviews));
  } else {
    console.log("$%");
  }
};

const initialState = {
  reviews: [], 
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_REVIEW: {
      const updatedReviews = state.reviews.filter(
        (review) => review.id !== action.reviewId
      );
      console.log("Updated Reviews:", updatedReviews);
      return { ...state, reviews: updatedReviews };
    }
    case LOAD_REVIEW_Id:
      return { ...state, reviews: action.reviews };
    case POST_REVIEW:
      return { ...state, reviews: action.payload };
    default:
      return state;
  }
};
export default reviewReducer;
