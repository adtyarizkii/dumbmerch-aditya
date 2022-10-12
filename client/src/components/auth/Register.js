import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { Alert } from 'react-bootstrap';
import { useMutation } from 'react-query'; //post data to database

import { API } from '../../config/api'; //base url

export default function Register() {

  const title = 'Register';
  document.title = 'DumbMerch | ' + title;

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault(); //agar tidak me-refresh

      // Configuration Content-type (JSON)
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      // Data body
      const body = JSON.stringify(form);

      // Insert data user to database
      const response = await API.post('/register', body, config);

      // Notification
      if (response.data.status === 'success...') {
        const alert = (
          <Alert variant="success" className="py-1">
            Success, please login to continue..
          </Alert>
        );
        setMessage(alert);
        setForm({
          name: '',
          email: '',
          password: '',
        });
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Failed, something wrong.
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      if (error.message == 'Request failed with status code 401'){
      const alertRegistered = (
        <Alert variant="danger" className="py-1">
          Email has already been registered!
        </Alert>
      );
      console.log(error);
      setMessage(alertRegistered);
      }
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
          className="mb-2"
        >
          Register
        </div>
        {message && message}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className="mt-3 form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={handleChange}
              className="px-3 py-2"
            />
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
            <button type="submit" className="btn btn-login">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
