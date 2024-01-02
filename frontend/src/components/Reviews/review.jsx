import { useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../store/review";
import "./review.css";

const ReviewPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotState = useSelector((state) => state.spot);
  const spot = spotState.spotDetails;
  const reviewState = useSelector((state) => state.review);
  const reviews = reviewState.reviews && reviewState.reviews.Reviews;
  const sessionState = useSelector((state) => state.session)
  const currentUser = sessionState.user
  let userId
  if(currentUser){
     userId = currentUser.id
  }
  const [isFetchingReviews, setIsFetchingReviews] = useState(false); //
  // useEffect(() => {
  //   dispatch(fetchReviews(spotId));
  // }, [dispatch, spotId]);

  useEffect(() => {

    if (!reviews && !isFetchingReviews) {

      setIsFetchingReviews(true);


      dispatch(fetchReviews(spotId)).then(() => {

        setIsFetchingReviews(false);
      });
    }
  }, [dispatch, spotId, reviews, isFetchingReviews]);


  let ownerId
  let isOwner
  if (spot) {
    ownerId = spot.ownerId
    if (ownerId === userId) {
      isOwner = true
    } else {
      isOwner = false
    }
  }




  if (!reviews ) {
    return <div>Loading...</div>;
  }


  const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  return (
    <div className="review-container">
      {!isOwner &&reviews.length === 0 ? (
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
