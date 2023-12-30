import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../store/review";
import "./review.css";

const ReviewPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  const reviewState = useSelector((state) => state.review);
  const reviews = reviewState.reviews && reviewState.reviews.Reviews;

  if (!reviews) {
    return <div>Loading...</div>;
  }

  return (
    <div className="review-container">
      {reviews.length === 0 ? (
        <p className="review">Be the first to post a review!</p>
      ) : (
        <>
          {reviews.map((review) => (
            <div key={review.id}>
              <p className="name">
                {review.User.firstName}
                <br />
              </p>
              <br />
              <p className="date">
                {new Date(review.createdAt).toLocaleString("en-us", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <br />
              <p className="review">{review.review}</p>
              <br />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ReviewPage;
