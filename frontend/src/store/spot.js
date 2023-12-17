const LOAD_SPOTS = "spots/LOAD_SPOTS";



const loadSpots = (data) => ({
  type: LOAD_SPOTS,
  data
});

export const fetchSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  dispatch(loadSpots());

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
  } else {
    console.log("noo good #################");
  }
};

const spotReducer = (state ={}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, spots:action.data, error: null };

    default:
      return state;
  }
};

export default spotReducer;
