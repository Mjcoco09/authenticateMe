import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spot";
import { spotImage } from "../../store/spot";
import "./SpotForm.css";
const SpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1);
  const [prevImg, setPrevImg] = useState("");
  const [imgOne, setImgOne] = useState("");
  const [imgTwo, setImgTwo] = useState("");
  const [imgThree, setImgThree] = useState("");
  const [imgFour, setImgFour] = useState("");
  const [imgFive, setImgFive] = useState("");
  const [error, setError] = useState("");

  const updateLat = (e) => setLat(e.target.value);
  const updateLng = (e) => setLng(e.target.value);
  const updateCountry = (e) => setCountry(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updatePrevImg = (e) => setPrevImg(e.target.value);
  const updateImgOne = (e) => setImgOne(e.target.value);
  const updateImgTwo = (e) => setImgTwo(e.target.value);
  const updateImgThree = (e) => setImgThree(e.target.value);
  const updateImgFour = (e) => setImgFour(e.target.value);
  const updateImgFive = (e) => setImgFive(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spotData = {
      country,
      address,
      city,
      state,
      description,
      name,
      price,
      lat,
      lng,
    };
    console.log(spotData,"this is spot data")

    let createdSpot;
    createdSpot = await dispatch(createSpot(spotData));
    const spotId = createSpot.id
    dispatch(spotImage({prevImg,spotId}))
    if (createdSpot) {
      navigate(`/spots/${createdSpot.id}`);
    }
  };

  return (
    <>
      <h1>Create a new Spot</h1>
      <h2 className="h2">
        Where's your place located? Guests will only get your exact address once
        they booked a reservation
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="formContainer">

          <input
            type="text"
            placeholder="Country"
            required
            value={country}
            onChange={updateCountry}
          />
          <input
            type="text"
            placeholder="Address"
            required
            value={address}
            onChange={updateAddress}
          />
          <input
            type="number"
            placeholder="Latitude"
            required
            value={lat}
            onChange={updateLat}
          />
          <input
            type="number"
            placeholder="Longitude"
            required
            value={lng}
            onChange={updateLng}
          />
          <input
            type="text"
            placeholder="City"
            required
            value={city}
            onChange={updateCity}
          />
          <input
            type="text"
            placeholder="State"
            required
            value={state}
            onChange={updateState}
          />
          <div className="dividerLine"></div>
          <h2>Describe your place to guests</h2>
          <h3>
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </h3>
          <input
            className="desc"
            type="text"
            placeholder="Please write at least 30 characters"
            required
            value={description}
            onChange={updateDescription}
          />
          <div className="dividerLine"></div>
          <h2>Create a title for your spot</h2>
          <h3></h3>
          <input
            type="text"
            placeholder="Name of your spot"
            required
            value={name}
            onChange={updateName}
          />
          <div className="dividerLine"></div>
          <h2>Set a base price for your spot</h2>
          <h3>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </h3>
          <br />
          <input
            type="number"
            placeholder="Price per night (USD)"
            required
            value={price}
            onChange={updatePrice}
          />
          <div className="dividerLine"></div>
          <h2>Liven up your spot with photos</h2>
          <h3>Submit a link to at least one photo to publish your spot.</h3>
          <input
            type="text"
            placeholder="Preview Image URL "

            value={prevImg}
            onChange={updatePrevImg}
          />
          <input
            type="text"
            placeholder="Image URL "

            value={imgOne}
            onChange={updateImgOne}
          />
          <input
            type="text"
            placeholder="Image URL "
            value={imgTwo}
            onChange={updateImgTwo}
          />
          <input
            type="text"
            placeholder="Image URL "
            value={imgThree}
            onChange={updateImgThree}
          />
          <input
            type="text"
            placeholder="Image URL "
            value={imgFour}
            onChange={updateImgFour}
          />
          <input
            type="text"
            placeholder="Image URL "
            value={imgFive}
            onChange={updateImgFive}
          />
          <button type="submit" className="submitB">
            Create a new spot
          </button>
        </div>
      </form>
    </>
  );
};
export default SpotForm;
