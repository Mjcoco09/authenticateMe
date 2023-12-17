import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spot";

function SpotList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const spotState = useSelector((state) => state.spot);
  const spots = spotState.spots;
  return (
    <>
      <h2>All Spots</h2>
      <ul>
        {spots && spots.map((spot) => (
          <li key={spot.id}>
            <br/>
            <h3>{spot.name}</h3>
            <br/>
            <p>{spot.price},<br/> {spot.city}, <br/>{spot.state}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
export default SpotList;
