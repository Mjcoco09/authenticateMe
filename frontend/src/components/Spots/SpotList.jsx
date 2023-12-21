import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spot";
import './SpotList.css'

function SpotList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const spotState = useSelector((state) => state.spot);
  const spots = spotState.spots;
  return (
    <div className="spot-list-container">
      <h2>All Spots</h2>
      <div className="spot-grid">
        {spots &&
          spots.map((spot) => (
            <div key={spot.id} className="spot-tile" title={spot.name}>
              <img
                src={spot.previewImage}
                alt={spot.name}
                className="spot-image"
              />
              <h3 className="text">{spot.name}</h3>
              <br/>
              <p className= "text"  >
                ${spot.price} a night -{ spot.city} {spot.state}
                </p>
                <br/>
                {isNaN(spot.avgRating) || spot.avgRating === null ? (
              <p className="new">NEW</p>
            ) : (

              <p className="text">Average Rating: {spot.avgRating}</p>
            )}
            <div className="tooltip">{spot.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default SpotList;
