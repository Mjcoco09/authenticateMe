const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";


const loadSpots = (data) => ({
  type: LOAD_SPOTS,
  data
});

const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

export const fetchSpotDetails = (spotId) => async (dispatch) =>{
  const res = await fetch(`/api/spots/${spotId}`)
  const spotDetails =await res.json();
  if(res.ok) {
    dispatch(loadSpotDetails(spotDetails))
    console.log(spotDetails,"$$$$$$$$$$")
  }else {
    console.log("no bueno")
  }
}

export const fetchSpots = () => async (dispatch) => {
  const res = await fetch("/api/spots");


  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpots(data.Spots));
  } else {
    console.log("noo good #################");
  }
};

const spotReducer = (state ={}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, spots:action.data, error: null };
    case LOAD_SPOT_DETAILS :
      return { ...state, spotDetails: action.spotDetails };
    default:
      return state;
  }
};

export default spotReducer;
