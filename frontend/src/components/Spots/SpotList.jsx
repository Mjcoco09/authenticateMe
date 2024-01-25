import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spot";
import { useNavigate } from "react-router-dom";
import "./SpotList.css";
import starImage from "../../../../images/star.png";

function SpotList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const spotState = useSelector((state) => state.spot);
  const spots = spotState.spots;
  return (
    <div className="spot-list-container">
      {/* <h2>All Spots</h2> */}
      <div className="spot-grid">
        {spots &&
          spots.map((spot) => (
            <div
              key={spot.id}
              className="spot-tile"
              title={spot.name}
              onClick={() => navigate(`/spots/${spot.id}`)}
            >

              <div className="spot-image">
                <img
                  src={spot.previewImage}
                  alt={spot.name}
                  className="spot-image"
                />
              </div>
              <div className="allCont">
              <div className="cityState">
                {spot.city}, {spot.state}
              </div>
              <div className="rating-container">
                {isNaN(spot.avgRating) || spot.avgRating === null ? (
                  <>
                    <div className="newDetails">NEW</div>
                    <div className="star-container-new">
                      <img
                        src={starImage}
                        alt={`Star ${spot.avgRating}`}
                        className="star-image"
                      />
                    </div>
                  </>
                ) : (
                  <div className="star-container">
                    <img
                      src={starImage}
                      alt={`Star ${spot.avgRating}`}
                      className="star-image"
                    />
                    <div className="textAVG">{spot.avgRating}</div>
                  </div>
                )}

              </div>

              {/* {isNaN(spot.avgRating) || spot.avgRating === null ? (
                  <>
                  <p className="new">NEW</p>
                  <br/>
                  </>
            ) : (
              <div className="star-container">
              <img src={starImage} alt={`Star ${spot.avgRating}`} className="star-image" />
              <span className="text">{spot.avgRating}</span>
            </div>
            )
            } */}
</div>
              <p className="text">${spot.price} a night</p>
              <br />
              {/* {isNaN(spot.avgRating) || spot.avgRating === null ? (
                  <>
                   <div className="rating-container">
                  <dev className="new">NEW</dev>
                  <div className="star-container-new">
              <img src={starImage} alt={`Star ${spot.avgRating}`} className="star-image" />
                  </div>
                  </div>
                  </>
            ) : (
              <div className="star-container">
              <img src={starImage} alt={`Star ${spot.avgRating}`} className="star-image" />
              <span className="text">{spot.avgRating}</span>
            </div>
            )
            } */}

              <div className="tooltip">{spot.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default SpotList;
