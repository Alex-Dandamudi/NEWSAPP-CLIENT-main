import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './authentication.module.css';




export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState({
    status: false,
    color: '',
    message: '',
  });


// Initialize LocalForage instance



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/login', { email, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      console.log(typeof(userId));
      navigate('/Articles');
    } catch (error) {
      if (error.response.status === 400) {
        setError({ status: true, color: 'red', message: error.response.data.message });
      } else {
        console.error('Error logging in:', error);
      }
    }
  };

  return (
    <>
      <div className={styles.login}>
        <form onSubmit={handleLogin} action="" method="post">
          <div>
            <label htmlFor="">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type="submit" value="Login" />
          <p>Don't Have An Account? <Link to='/registration'>Register</Link></p>
          {(err.status) ? <p style={{ color: err.color }}>{err.message}</p> : ''}
        </form>
      </div>
    </>
  );
}
