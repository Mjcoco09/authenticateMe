import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postReview } from "../../store/review";
import { useModal } from "../../context/Modal";
import "./postReview.css";

function PostReviewModal({ navigate }) {
  let createdReview;
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const sessionState = useSelector((state) => state.session.user);
  const spotState = useSelector((state) => state.spot);
  const spotId = spotState.spotDetails.id;

  // const userId = sessionState.user.id

  const [stars, setStar] = useState(1);
  const [review, setReviewText] = useState("");
  const [error, setError] = useState({});
  const updateStar = (e) => setStar(e.target.value);
  const updateText = (e) => setReviewText(e.target.value);

  useEffect(() => {
    const newErr = {};
    if (review.length < 10) {
      newErr.review = "has to be 10 chars";
    }
    setError(newErr);
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      stars,
      review,
    };
    closeModal;

    createdReview = await dispatch(postReview(payload, spotId));
    if (createdReview) {
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>How was your stay?</h2>
      <div className="overlay">
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h1>Post Your Review</h1>
          <label>
            Review:
            <input
              placeholder="Leave your Review here"
              value={review}
              onChange={updateText}
            />
            {/* <br/>
              {error.review && <p>{error.review}</p>} */}
          </label>
          <label>
            Stars:
            <input
              type="number"
              value={stars}
              onChange={updateStar}
              min={1}
              max={5}
            />
          </label>

          <button
            type="submit"
            className="submitButton"
            disabled={error.review}
          >
            Submit Your Review
          </button>
        </div>
      </div>
    </form>
  );
}

export default PostReviewModal;
