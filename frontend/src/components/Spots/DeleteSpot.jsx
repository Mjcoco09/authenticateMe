import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { removeSpot } from "../../store/spot";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css"
const DeleteSpot = ({navigate}) => {
    const { closeModal } = useModal();
    const spotState = useSelector((state) => state.spot);
    const spots = spotState.spots;
  const dispatch = useDispatch();
  const handleDelete = (spotId) => {
    dispatch(removeSpot(spotId));
    navigate(`/spots/current`)
    closeModal()
  };

  return (

    <div>

      {spots &&
        spots.map((spot) => (
          <div key={spot.id} className="spot-tile">
           <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this spot
from the listings?</h3>
            <button className="delete" onClick={() => handleDelete(spot.id) }>Yes(Delete Spot)</button>
            <button className="keep" onClick={closeModal}>No(Keep Spot)</button>
          </div>
        ))}

    </div>
  );

};
export default DeleteSpot
