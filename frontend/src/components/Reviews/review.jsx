import { useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../store/review";
import "./review.css";

const ReviewPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();


  const reviewState = useSelector((state) => state.review);
  const reviews = reviewState.reviews && reviewState.reviews.Reviews;
  console.log(reviews)

  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);



  if (!reviews) {
    return <div>Loading...</div>;
  }


  const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  return (
    <div className="review-container">
      {reviews.length === 0 ? (
        <p className="review">Be the first to post a review!</p>
      ) : (
        <>
        <br/>
          {sortedReviews.map((review) => (
            <div key={review.id}>
              <p className="name">
                {review.User.firstName }

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
