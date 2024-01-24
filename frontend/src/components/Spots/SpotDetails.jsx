import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spot";
import PostReviewModal from "../Reviews/PostReview";
import starImage from "../../../../images/star.png";
import ReviewPage from "../Reviews/review";
import "./SpotDetails.css";
import DeleteReview from "../Reviews/DeleteReview";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { fetchReviews } from "../../store/review";

const SpotDetailsPage = () => {
  const navigate = useNavigate();
  const sessionState = useSelector((state) => state.session);
  const currentUser = sessionState.user;
  let userId;
  if (currentUser) {
    userId = currentUser.id;
  }
  let userHasPostedReview;
  const reviewState = useSelector((state) => state.review);
  const reviewArr = reviewState.reviews && reviewState.reviews.Reviews;
  let arrLength;
  if (reviewArr) {
    arrLength = reviewArr.length;
  }

  const dispatch = useDispatch();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId, arrLength]);
  const spotState = useSelector((state) => state.spot);
  const spot = spotState.spotDetails;
  let ownerId;
  let isOwner;
  if (spot) {
    ownerId = spot.ownerId;
    if (ownerId === userId) {
      isOwner = true;
    } else {
      isOwner = false;
    }
  }

  if (!spot) {
    return <div>Loading...</div>;
  }

  // useEffect(()=> {
  //  // if (reviewArr) {

  //   //   const userReviewIds = reviewArr.map((review) => review.userId);
  //   //   userHasPostedReview = userReviewIds.includes(userId);
  //   // }
  // },[])

  if (reviewArr) {
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
        {spot.SpotImages && spot.SpotImages.length > 0 && (
          <div>
            <br />

            {spot.SpotImages.slice(0, 1).map((image, index) => (
              <React.Fragment key={index}>
                <img src={image.url} alt={`Big Image`} className="big-image" />
                <br />
              </React.Fragment>
            ))}

            <div className="small-images-container">
              {spot.SpotImages.slice(1, 4).map((image, index) => (
                <React.Fragment key={index}>
                  <img
                    src={image.url}
                    alt={`Small Image ${index + 1}`}
                    className="small-image"
                  />
                </React.Fragment>
              ))}
            </div>

            <br />
          </div>
        )}

        {/* {spot.spotDetails&&<img src={spot.spotDetails.SpotImages[0]} alt={spot.name} />}
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
        )} */}
      </div>
      <div>
        <br />
        <p className="text">
          Location: {spot.city}, {spot.state}, {spot.country}
        </p>
        <br />
        <p className="text">
          Hosted by {spot.Owner && spot.Owner.firstName}{" "}
          {spot.Owner && spot.Owner.lastName}
        </p>
        <br />
        <p className="text">Description: {spot.description}</p>
      </div>
      <div className="reserveContainer">
        <p className="textPriceText">${spot.price} per night  </p>
        {isNaN(spot.avgStarRating) || spot.avgStarRating === null ? (
          <>
          <img
              src={starImage}
              alt={`Star ${spot.avgStarRating}`}
              className="star-image"
            />
            <p className="newStar">NEW</p>

          </>
        ) : (
          <div className="star-container-details">
            <img
              src={starImage}
              alt={`Star ${spot.avgStarRating}`}
              className="star-image"
            />
            <p className="text">{spot.avgStarRating}</p>
            <br />
          </div>
        )}
        <div className="reviewCount">
          {spot.numReviews > 0 && <span className="dot">·</span>}
          {spot.numReviews > 0 && (
            <p className="text">
              {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
            </p>
          )}
        </div>
        <button className="reserveButton" onClick={alertButton}>
          Reserve
        </button>
      </div>
      <div className="dividerLine"></div>
      <div className="reviewSection">
        {isNaN(spot.avgStarRating) || spot.avgStarRating === null ? (
          <>
            <img
              src={starImage}
              alt={`Star ${spot.avgStarRating}`}
              className="star-imageReview"
            />
            <p className="new">NEW</p>
            <br />
          </>
        ) : (
          <div className="star-container-details">
            <img
              src={starImage}
              alt={`Star ${spot.avgStarRating}`}
              className="star-image"
            />
            <p className="text">{spot.avgStarRating}</p>
          </div>
        )}
        {spot.numReviews > 0 && (
          <p className="text">
            {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
          </p>
        )}
        <ReviewPage />
      </div>
      {currentUser && userHasPostedReview && (
        <OpenModalButton
          buttonText="Delete Review"
          modalComponent={<DeleteReview navigate={navigate} />}
        />
      )}
      {currentUser && !userHasPostedReview && !isOwner && (
        <OpenModalButton
          className="postReview"
          buttonText="Post Your Reviews"
          modalComponent={<PostReviewModal navigate={navigate} />}
        />
      )}
      <br />
    </div>
  );
};

export default SpotDetailsPage;
