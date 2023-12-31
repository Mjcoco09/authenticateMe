import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SpotForm from "../Spots/SpotForm";
import "./Navigation.css";
import logo from "../../../public/favicon.ico";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const handleCreateSpot = () => {
    navigate("/spots/new");
  };

  return (
    <>
      <ul className="nav">
        <li className="logo-item">
          <NavLink exact to="/">
            <img src={logo} alt="My Logo" className="logo" />
          </NavLink>
        </li>
        <li>
          <button onClick={handleCreateSpot} className="createButton">Create a spot</button>

        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </>
  );
}

export default Navigation;
