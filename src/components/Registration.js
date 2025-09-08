import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Install Axios library
import styles from './authentication.module.css';

export default function Registration() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [err, setError] = useState({
    status: false,
    color: '',
    message: '',
  });

  const inputHandle = (e) => {
    setData((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const formHandle = async (e) => {
    e.preventDefault();

    if (data.email && data.password && data.firstName && data.lastName) {
      try {
        await axios.post('http://localhost:4000/api/register', data);
        navigate('/login');
      } catch (error) {
        if (error.response.status === 400) {
          setError({ status: true, color: 'red', message: error.response.data.message });
        } else {
          console.error('Error registering:', error);
        }
      }
    } else {
      setError({ status: true, color: 'red', message: 'All fields are required' });
    }
  };

  return (
    <>
      <div className={styles.registration}>
        <form onSubmit={formHandle} action="" method="post">
          <div>
            <label htmlFor="">First Name</label>
            <input
              type="text"
              name="firstName"
              value={data.firstName || ''}
              onChange={inputHandle}
            />
          </div>
          <div>
            <label htmlFor="">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={data.lastName || ''}
              onChange={inputHandle}
            />
          </div>
          <div>
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              value={data.email || ''}
              onChange={inputHandle}
            />
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              value={data.password || ''}
              onChange={inputHandle}
            />
          </div>
          <input type="submit" value="Register" />
          <p>Already Have An Account? <Link to='/login'>Log In</Link></p>
          {(err.status) ? <p style={{ color: err.color }}>{err.message}</p> : ''}
        </form>
      </div>
    </>
  );
}
