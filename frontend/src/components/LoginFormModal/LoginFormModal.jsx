import { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState({});
  const [buttonPressed, setButtonPressed] = useState(false);
  const handleDemoUser = () => {
    dispatch(sessionActions.login({
      credential: "demouser@demo.com",
      password: "demopassword",
    }))
    closeModal()
  };

  useEffect(() => {
    if(buttonPressed){
    const newErr = {};

    if (credential.length < 4) {
      newErr.credential = "Username or Email must be greater than 4 characters";
    } else {
      newErr.credential = "";
    }

    if (password.length < 6) {
      newErr.password = "Password must be more than 6 characters";
    } else {
      newErr.password = "";
    }


    setErr(newErr);
  }
  }, [credential, password,buttonPressed]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonPressed(true);
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);

        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {err.credential && <p>{err.credential}</p>}
        <label>
          Password
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        {err.password && <p>{err.password}</p>}
        <button disabled={err.credential || err.password}  type="submit" className="login">
          Log In
        </button>
        <button
                type="button"
                onClick={handleDemoUser}
                className="demo-user"
              >
                Demo User
              </button>
      </form>
    </>
  );
}

export default LoginFormModal
