import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentSpot } from "../../store/spot";
import "./SpotList.css";
import starImage from "../../../../images/star.png";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpot from "./DeleteSpot";
function CurrentSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCurrentSpot());
  }, [dispatch]);

  const spotState = useSelector((state) => state.spot);
  const spots = spotState.spots;
  const handleDeleteSpot = (e) => {
    e.stopPropagation();
    console.log("Delete button clicked. Event propagation stopped.");
  };

  return (
    <>
      {spots && spots.length >= 1 ? (
        <div className="spot-list-container">
          <h2>Manage Spots</h2>
          <button onClick={() => navigate("/spots/new")}>Create Spot</button>
          <div className="spot-grid">
            {spots &&
              spots.map((spot) => (
                <div
                  key={spot.id}
                  className="spot-tile"
                  title={spot.name}
                  onClick={() => navigate(`/spots/${spot.id}`)}
                >
                  <img
                    src={spot.previewImage}
                    alt={spot.name}
                    className="spot-image"
                  />
                  <br />
                  {isNaN(spot.avgRating) || spot.avgRating === null ? (
                    <>
                      <p className="new">NEW</p>
                      <br />
                    </>
                  ) : (
                    <div className="star-container">
                      <img
                        src={starImage}
                        alt={`Star ${spot.avgRating}`}
                        className="star-image"
                      />
                      <span className="text">{spot.avgRating}</span>
                    </div>
                  )}
                  <p className="text">
                    ${spot.price} a night -{spot.city} {spot.state}
                  </p>
                  <br />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/spots/${spot.id}/edit`);
                    }}
                  >
                    Update
                  </button>
                  <button onClick={handleDeleteSpot} >
                  <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteSpot navigate={navigate}
                  />
                }

                    />
                    </button>
                  <br />

                  <div className="tooltip">{spot.name}</div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <>
          <h2>You dont have any spots yet would you like to create one?</h2>
          <button onClick={() => navigate("/spots/new")}>Create Spot</button>
        </>
      )}
    </>
  );
}

export default CurrentSpots;
