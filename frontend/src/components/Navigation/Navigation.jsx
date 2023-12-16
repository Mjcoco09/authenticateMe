import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../../public/favicon.ico";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
    <ul className="nav">
    <li className="logo-item">
    <NavLink exact to="/">
      <img src={logo} alt="My Logo" className="logo" />
      </NavLink>
    </li>
    {/* <li>
      <NavLink exact to="/">
        Home
      </NavLink>
    </li> */}
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
