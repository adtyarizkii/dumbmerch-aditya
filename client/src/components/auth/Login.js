import { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useMutation } from 'react-query';

import { API } from '../../config/api';

export default function Login() {
  let navigate = useNavigate();

  const title = 'Login';
  document.title = 'DumbMerch | ' + title;

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      // Data body
      const body = JSON.stringify(form);

      // Insert data for login process
      const response = await API.post('/login', body, config);

      // Checking process
      if (response?.status === 200) {
        // Send data to useContext
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data.data,
        });

        // Status check
        if (response.data.data.status === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }

        const alert = (
          <Alert variant="success" className="py-1">
            Login success!
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      if (error.message == 'Request failed with status code 402'){
        const alertPassword = (
          <Alert variant="danger" className="py-1">
           Email not found!
          </Alert>
        );
      setMessage(alertPassword);
       }
      if (error.message == 'Request failed with status code 403'){
        const alertPassword = (
          <Alert variant="danger" className="py-1">
           Password not match!
          </Alert>
        );
      setMessage(alertPassword);
       }
      console.log(error);
    }
  });

  function ShowPass() {
    let x = document.getElementById("ShowPass");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="card-auth p-4">
        <div
          style={{ fontSize: '36px', lineHeight: '49px', fontWeight: '700' }}
          className="mb-3"
        >
          Login
        </div>
        {message && message}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className="mt-3 form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              id='ShowPass'
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
            <div>
            <input 
              type="checkbox"
              id='Show'
              onClick={ShowPass}
              className="showpass mt-3"
            /><label for="Show">Show Password</label>
          </div>
          </div>
          <div className="d-grid gap-2 mt-2">
            <button className="btn btn-login">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
