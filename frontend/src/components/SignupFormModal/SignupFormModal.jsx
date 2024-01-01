import { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './signupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    setErrors({});
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form id = "sign-form" onSubmit={handleSubmit}>
        <label>
          Email

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {errors.email && <><br />
        <p>{errors.email}</p>
        </> }
          Username
        <label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

        </label>
        {errors.username &&<>
          <br />
        <p>{errors.username}</p></>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName &&<><br />
        <p>{errors.firstName}</p>
        </> }
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <><br />
        <p>{errors.lastName}</p>
        </>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password &&<>
        <br />
        <p>{errors.password}</p>
        </> }
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <>
        <br/>
        <p>{errors.confirmPassword}</p>
        </>}
        <button disabled={errors.email || errors.username || errors.password || errors.firstName || errors.lastName}type="submit" className='signUp'>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
