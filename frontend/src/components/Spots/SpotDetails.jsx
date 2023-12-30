import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spot";
import starImage from "../../../../images/star.png";
import ReviewPage from "../Reviews/review";
import "./SpotDetails.css";

const SpotDetailsPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  const spotState = useSelector((state) => state.spot);
  const spot = spotState.spotDetails;

  if (!spot) {
    return <div>Loading...</div>;
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
              <>
                <img
                  key={index}
                  src={image.url}
                  alt={`Small Image ${index + 1}`}
                />
                <br />
              </>
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
       { isNaN(spot.avgStarRating) || spot.avgStarRating === null ? (
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
      </div>
          <br/>
      <ReviewPage />
    </div>
  );
};

export default SpotDetailsPage;
