import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spot";
import { spotImage } from "../../store/spot";
import "./SpotForm.css";
const SpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [submitted, setSubmitted] = useState(false);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [prevImg, setPrevImg] = useState("");
  const [imgOne, setImgOne] = useState("");
  const [imgTwo, setImgTwo] = useState("");
  const [imgThree, setImgThree] = useState("");
  const [imgFour, setImgFour] = useState("");
  const [imgFive, setImgFive] = useState("");
  const [error, setError] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

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
  let preview = true;

  useEffect(() => {
    const newErr = {};

    if (!country) {
      newErr.country = "Country is required";
    }
    if (!address) {
      newErr.address = "Address is required";
    }
    if (!lat) {
      newErr.lat = "Latitude is required";
    }
    if (!lng) {
      newErr.lng = "Longitude is required";
    }
    if (!city) {
      newErr.city = "City is required";
    }
    if (!state) {
      newErr.state = "State is required";
    }
    if (!name) {
      newErr.name = "Name is required";
    }
    if (!price) {
      newErr.price = "Price is required";
    }
    if (!prevImg) {
      newErr.prevImg = "Preview image is required";
    }

    // if (!imgOne) {
    //   newErr.imgOne = "One image is required";
    // }

    if (description.length < 30) {
      newErr.description = "Description needs a minimum of 30 characters";
    }
    if (description && description.length >= 300) {
      newErr.description = "Description cannot be 300 characters or more";
    }
    if (prevImg && !/\.(png|jpg|jpeg)$/.test(prevImg.toLowerCase())) {
      newErr.prevImg = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (imgOne && !/\.(png|jpg|jpeg)$/.test(imgOne.toLowerCase())) {
      newErr.imgOne = "Image URL must end in .png, .jpg, or .jpeg";
    }

    setError(newErr);
  }, [
    country,
    address,
    lat,
    lng,
    city,
    state,
    name,
    price,
    prevImg,
    description,
    imgOne,
    formSubmitted,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (
      error.country ||
      error.address ||
      error.lat ||
      error.lng ||
      error.city ||
      error.state ||
      error.name ||
      error.price ||
      error.prevImg ||
      error.description ||
      error.prevImg
    ) {
      return; // Exit the function when there are errors
    } else {
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
      const imageData = {
        preview,
        url: prevImg,
      };
      const imgOneData = {
        preview,
        url: imgOne,
      }; //
      const imgTwoData = {
        preview,
        url: imgTwo,
      }; //
      const imgThreeData = {
        preview,
        url: imgThree,
      }; //
      const imgFourData = {
        preview,
        url: imgFour,
      }; //
      const imgFiveData = {
        preview,
        url: imgFive,
      }; //

      let createdSpot;
      createdSpot = await dispatch(createSpot(spotData));
      const spotId = createdSpot.id;
      //let createdImage;

      dispatch(spotImage(imageData, spotId));
      if (createdSpot) {
        navigate(`/spots/${createdSpot.id}`);
      }
      if (imgOne) {
        dispatch(spotImage(imgOneData, spotId));
      } //
      if (imgTwo) {
        dispatch(spotImage(imgTwoData, spotId));
      } //
      if (imgThree) {
        dispatch(spotImage(imgThreeData, spotId));
      } //
      if (imgFour) {
        dispatch(spotImage(imgFourData, spotId));
      } //
      if (imgFive) {
        dispatch(spotImage(imgFiveData, spotId));
      } //
    }
  };

  return (
    <>
      <h1>Create a new Spot</h1>
      <h2 className="h2">
        Where&apos;s your place located? Guests will only get your exact address
        once they booked a reservation
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="formContainer">
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={updateCountry}
          />
          <br />
          {formSubmitted && error.country && (
            <p className="error">{error.country}</p>
          )}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={updateAddress}
          />
          <br />
          {formSubmitted && error.address && (
            <p className="error">{error.address}</p>
          )}
          <input
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={updateLat}
          />
          <br />
          {formSubmitted && error.lat && <p className="error">{error.lat}</p>}
          <input
            type="number"
            placeholder="Longitude"
            value={lng}
            onChange={updateLng}
          />
          <br />
          {formSubmitted && error.lng && <p className="error">{error.lng}</p>}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={updateCity}
          />
          <br />
          {formSubmitted && error.city && <p className="error">{error.city}</p>}
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={updateState}
          />
          <br />
          {formSubmitted && error.state && (
            <p className="error">{error.state}</p>
          )}
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
            value={description}
            onChange={updateDescription}
          />
          <br />
          {formSubmitted && error.description && (
            <p className="error">{error.description}</p>
          )}
          <div className="dividerLine"></div>
          <h2>Create a title for your spot</h2>
          <h3>
            Catch guest&apos;s attention with a spot title that highlights what
            makes your place special
          </h3>
          <input
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={updateName}
          />
          <br />
          {formSubmitted && error.name && <p className="error">{error.name}</p>}
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
            min={1}
            value={price}
            onChange={updatePrice}
          />
          <br />
          {formSubmitted && error.price && (
            <p className="error">{error.price}</p>
          )}
          <div className="dividerLine"></div>
          <h2>Liven up your spot with photos</h2>
          <h3>Submit a link to at least one photo to publish your spot.</h3>
          <input
            type="text"
            placeholder="Preview Image URL "
            value={prevImg}
            onChange={updatePrevImg}
          />
          <br />
          {formSubmitted && error.prevImg && (
            <p className="error">{error.prevImg}</p>
          )}
          <input
            type="text"
            placeholder="Image URL "
            value={imgOne}
            onChange={updateImgOne}
          />
          <br />
          {formSubmitted && error.imgOne && (
            <p className="error">{error.imgOne}</p>
          )}
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
          <button
            type="submit"
            className="submitB"
            // disabled={
            //   formSubmitted&&
            //   error.name ||
            //   error.country ||
            //   error.address ||
            //   error.lat ||
            //   error.lng ||
            //   error.city ||
            //   error.state ||
            //   error.price ||
            //   error.prevImg ||
            //   error.description
            // }
          >
            Create spot
          </button>
        </div>
      </form>
    </>
  );
};
export default SpotForm;
