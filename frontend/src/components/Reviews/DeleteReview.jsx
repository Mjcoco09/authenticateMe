import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { removeReview } from '../../store/review';
import { useModal } from "../../context/Modal";

const DeleteReview = ({navigate}) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const sessionState = useSelector((state) => state.session);
    const reviewState = useSelector((state) => state.review);
    const spotState = useSelector((state) => state.spot)
    const spotId = spotState.spotDetails.id

    const currentUser = sessionState ? sessionState.user : null;
    const userId = currentUser ? currentUser.id : null;

    const reviews = reviewState.reviews.Reviews;

    const handleDelete = () => {
        const reviewToDelete = reviews.find(review => review.userId === userId);
        if (reviewToDelete) {
            dispatch(removeReview(reviewToDelete.id));
            closeModal();
            navigate(`/spots/${spotId}`)
        } else {
            console.error("Review not found for the current user");
        }
    };

    return (
        <div>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete}>Yes, Delete Review</button>
            <button onClick={closeModal}>No, Cancel</button>
        </div>
    );
};

export default DeleteReview;
