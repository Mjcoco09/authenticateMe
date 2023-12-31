import { csrfFetch } from "./csrf";
const LOAD_REVIEW_Id = "reviews/LOAD_REVIEWS_Id";
const POST_REVIEW = "reviews/POST_REVIEW"



const insertReview = (payload) => ({
  type:POST_REVIEW,
  payload,
})
const loadReviewId = (reviews) => ({
  type: LOAD_REVIEW_Id,
  reviews,
});

export const postReview = (payload,spotId) => async (dispatch) =>{
  const res = await csrfFetch(`/api/spots/${spotId}/reviews` , {
    method:"POST",
    body:JSON.stringify(payload)
  })
  const data = await res.json()
  dispatch(insertReview(data))
  return data
}
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
      case POST_REVIEW:
        return {...state,reviews:action.payload}
      default:
        return state
  }
};

export default reviewReducer
