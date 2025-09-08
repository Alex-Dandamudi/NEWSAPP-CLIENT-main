import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Install Axios library
import styles from './articles.module.css';

const mongoose = require('mongoose');


const Articles = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submittedArticles, setSubmittedArticles] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [summaryInput, setSummaryInput] = useState('');
  const [file, setFile] = useState(null);


  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  

  
  const stringUserId = localStorage.getItem('userId');
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log(file);
    // Retrieve the userId string from LocalStorage
  
    if (isLoggedIn && titleInput && summaryInput && stringUserId) {
      // Convert the userId string to ObjectId
      const userId = new mongoose.Types.ObjectId(stringUserId);
  
      const formData = new FormData();
      formData.append('title', titleInput);
      formData.append('summary', summaryInput);
      formData.append('userId', userId);
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:4000/api/article', formData);

        setSubmittedArticles([...submittedArticles, response.data]);
        setTitleInput('');
        setSummaryInput('');
        setFile(null);
      } catch (error) {
        console.error('Error submitting article:', error);
      }
    } else if (!isLoggedIn) {
      alert('Please log in to submit articles.');
    } else {
      alert('Please enter title and summary.');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  
  useEffect(() => {
    const fetchUserArticles = async () => {
      if (isLoggedIn) {
        const userId = localStorage.getItem('userId');
        try {
          const response = await axios.get(`http://localhost:4000/api/articles/${userId}`);
          const userArticles = response.data;
          setSubmittedArticles(userArticles);
        } catch (error) {
          console.error('Error fetching user articles:', error);
        }
      }
    };
    fetchUserArticles();
  }, [ isLoggedIn]);

 
  
  

  const handleDeleteArticle = async (articleId, filePath) => {
    try {
      
      await axios.delete(`http://localhost:4000/api/article/${articleId}`);

      // Delete the file associated with the article on the server
      window.location.reload();
      if (filePath) {
        await axios.delete(`http://localhost:4000/api/file/${filePath}`);
      }
      setSubmittedArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>myArticles</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter the title here"
          className={styles.titleInput}
          value={titleInput}
          onChange={(event) => setTitleInput(event.target.value)}
        />
        <textarea
          placeholder="enter the summary here"
          className={styles.summaryInput}
          value={summaryInput}
          onChange={(event) => setSummaryInput(event.target.value)}
        />
        
        <input className={styles.file} type="file" accept="image/*, video/*" onChange={handleFileChange} />
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
      <div className={styles.submittedArticles}>
        <h2>Submitted Articles</h2>
        {submittedArticles.map((article, index) => (
          <div key={index} className={styles.article}>
            <div>
              {article.filePath && (
                <div className='image'>
                  {article.isImage ? (
                    <img width="400" height="300"
                    src={`http://localhost:4000/${encodeURIComponent(article.filePath)}`}
                    alt="article"
                  />
                  ) : (
                    <video width="600" height="600" loop autoPlay controls>
                      <source
                        src={`http://localhost:4000/${encodeURIComponent(article.filePath)}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </div>
            <button className={styles.deleteButton} onClick={() => handleDeleteArticle(article._id,article.filePath)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
