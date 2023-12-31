import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spot";
import PostReviewModal from "../Reviews/PostReview";
import starImage from "../../../../images/star.png";
import ReviewPage from "../Reviews/review";
import "./SpotDetails.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";



const SpotDetailsPage = () => {
  const sessionState = useSelector((state) => state.session)
  const currentUser = sessionState.user
let userId
  if(currentUser){
     userId = currentUser.id
  }
  let userHasPostedReview
  const reviewState = useSelector((state) => state.review)
  const reviewArr = reviewState.reviews && reviewState.reviews.Reviews;
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { spotId } = useParams();
  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  const spotState = useSelector((state) => state.spot);
  const spot = spotState.spotDetails;
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

  if (!spot) {
    return <div>Loading...</div>;
  }

  if(reviewArr){
    const userReviewIds = reviewArr.map((review) => review.userId);
    userHasPostedReview = userReviewIds.includes(userId);
  }

  const alertButton = () => {
    alert("Feature coming soon");
  };

  return (
    <div>
      <h2 className="text">{spot.name}</h2>
      <div>
        <img src={spot.previewImage} alt={spot.name} />
        <br />
        {spot.SpotImages && spot.SpotImages.length > 0 && (
          <div>
            <br />
            {spot.SpotImages.slice(0, 4).map((image, index) => (
              <React.Fragment key={index}>
                <img
                  src={image.url}
                  alt={`Small Image ${index + 1}`}
                />
                <br />
              </React.Fragment>
            ))}
            <br />
          </div>
        )}
      </div>
      <div>
        <br />
        <p className="text">
          Location: {spot.city}, {spot.state}, {spot.country}
        </p>
        <br />
        <p className="text">
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </p>
        <br />
        <p className="text">Description: {spot.description}</p>
      </div>
      <div className="reserveContainer">
        <p className="text priceText">${spot.price} per night</p>
        {isNaN(spot.avgStarRating) || spot.avgStarRating === null ? (
          <>
            <br />
            <p className="new">NEW</p>
            <br />
          </>
        ) : (
          <div className="star-container">
            <img
              src={starImage}
              alt={`Star ${spot.avgStarRating}`}
              className="star-image"
            />
            <span className="text">{spot.avgStarRating}</span>
          </div>
        )}
        <button className="reserveButton" onClick={alertButton}>
          Reserve
        </button>
        {spot.numReviews > 0 && (
          <p className="text">
            {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
          </p>
        )}
      </div>
      <div className="dividerLine"></div>
      <div className="reviewSection">
        {isNaN(spot.avgStarRating) || spot.avgStarRating === null ? (
          <>
            <br />
            <p className="new">NEW</p>
            <br />
          </>
        ) : (
          <div className="star-container">
            <img
              src={starImage}
              alt={`Star ${spot.avgStarRating}`}
              className="star-image"
            />
            <span className="text">{spot.avgStarRating}</span>
          </div>
        )}
        {spot.numReviews > 0 && (
          <p className="text">
            {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
          </p>
        )}
        <ReviewPage />

      </div>
      { currentUser && !userHasPostedReview && !isOwner &&
          <OpenModalButton
            className="postReview"
            buttonText="Post Your Reviews"
            modalComponent={<PostReviewModal /> }
          />
      }
    <br/>
    </div>
  );
};

export default SpotDetailsPage;
