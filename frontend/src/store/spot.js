import { csrfFetch } from "./csrf";
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const ADD_ONE = "spots/ADD_ONE";
const ADD_IMAGE = "spots/ADD_IMAGE";
const LOAD_CURRENT = "spots/LOAD_CURRENT";
const EDIT_SPOT = "spots/EDIT_SPOT";
const DELETE_SPOT = "spots.DELETE_SPOT";

const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

const edSpot = (payload) => ({
  type: EDIT_SPOT,
  payload,
});

const loadCurr = (data) => ({
  type: LOAD_CURRENT,
  data,
});

const postImage = (data) => ({
  type: ADD_IMAGE,
  data,
});

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

export const removeSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteSpot(spotId));
  } else {
    const err = await res.json();
    return err;
  }
};

export const spotImage = ({ url, spotId, preview }) =>async (dispatch) => {
    const res = await csrfFetch(`api/spots/${spotId}/images`, {
      method: "POST",
      body: JSON.stringify({ url, preview }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(postImage(data));
      console.log("res is ok");
      console.log(data);
      return data;
    } else {
      console.log("nothing happend");
    }
  };

export const createSpot = (payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    console.log("res is ok");
    const data = await res.json();
    dispatch(addOneSpot(data));
    return data;
  } else {
    console.log("res isnt ok");
    const err = await res.json();
    console.log(err);
    return err;
  }
};

export const editSpot = (payload, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(edSpot(data));
    return data;
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

export const fetchCurrentSpot = () => async (dispatch) => {
  const res = await fetch("/api/spots/current");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadCurr(data.Spots));
    console.log("current available");
  } else {
    console.log("current not available");
    const err = await res.json;
    return err;
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
    case EDIT_SPOT: {
      const updatedSpotDetails = { ...state.spotDetails, ...action.payload };
      return { ...state, spotDetails: updatedSpotDetails };
    }
    case DELETE_SPOT: {
      const updatedSpots = state.spots.filter(
        (spot) => spot.id !== action.spotId
      );
      return { ...state, spots: updatedSpots };
    }
    case LOAD_SPOTS:
      return { ...state, spots: action.data, error: null };
    case LOAD_CURRENT:
      return { ...state, spots: action.data };
    case LOAD_SPOT_DETAILS:
      return { ...state, spotDetails: action.spotDetails };
    case ADD_IMAGE:
      return {
        ...state,
        spotDetails: {
          ...state.spot.spotDetails,
          SpotImages: action.data,
        },
      };
    default:
      return state;
  }
};

//hello

export default spotReducer;
