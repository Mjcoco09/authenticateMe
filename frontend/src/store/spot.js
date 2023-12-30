import { csrfFetch } from "./csrf";
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const ADD_ONE = "spots/ADD_ONE";
const ADD_IMAGE= "spots/ADD_IMAGE"

const postImage = (data) =>( {
  type:ADD_IMAGE,
  data
})

const addOneSpot = (payload) => ({
  type: ADD_ONE,
  payload,
});

const loadSpots = (data) => ({
  type: LOAD_SPOTS,
  data,
});

const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails,
});

export const spotImage = ({prevImg,spotId}) => async (dispatch) => {
  const preview = true
  const res= await csrfFetch(`api/spots/${spotId}/images` , {
    method: "POST",
    body: JSON.stringify({prevImg,preview})
  })

  const data =await res.json()
  dispatch(postImage(data.prevImg))
  return data


}

export const createSpot = (payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addOneSpot(data));
    return data
  } else {
    const err = await res.json();
    console.log(err);
    return err;
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);
  const spotDetails = await res.json();
  if (res.ok) {
    dispatch(loadSpotDetails(spotDetails));
  } else {
    console.log("no bueno");
  }
};

export const fetchSpots = () => async (dispatch) => {
  const res = await fetch("/api/spots");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpots(data.Spots));
  } else {
    console.log("noo good #################");
  }
};

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_ONE:
      return { ...state, spots: [...(state.spots || []), action.payload] };
    case LOAD_SPOTS:
      return { ...state, spots: action.data, error: null };
    case LOAD_SPOT_DETAILS:
      return { ...state, spotDetails: action.spotDetails };
    case ADD_IMAGE:
      return { ...state, images: [...(state.images || []), action.data] };
    default:
      return state;
  }
};

//hello

export default spotReducer;
