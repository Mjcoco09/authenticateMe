
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };
  function handleSubmit(){
    navigate("/spots/current")
    }


  useEffect(() => {
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);
  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };
  // const handleDemoUser = () => {
  //   dispatch(sessionActions.login({
  //     credential: "demouser@demo.com",
  //     password: "demopassword",
  //   }))
  //     .then(closeMenu)
  //     .catch((error) => {
  //       console.error("Demo user login error:", error);
  //     });
  // };
  const ulClassName = `profile-dropdown ${showMenu ? 'visible' : 'hidden'}`;

  return (
    <>
      <button onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{"Hello "}{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
            <button onClick={handleSubmit}>Manage Spots</button>
          </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>

            <li>
            {/* <button
                type="button"
                onClick={handleDemoUser}
                className="demo-user"
              >
                Demo User
              </button> */}
            </li>
          </>
        )}
      </ul>

    </>
  );
}

export default ProfileButton;
