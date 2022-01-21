import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    try {
      fetch('http://localhost:4000/videos')
      .then(res => res.json())
      .then(data => setVideos(data));  
    } catch (e) {
      console.log(e);
    }
  }, [])

  return (
    <div className="app">
      <Header />
      <div className="content-container">
          <div className="row">
              {videos.map(video =>
                <div className="col-md-4" key={video.id}>
                    <Link to={`/player/${video.id}`}>
                        <div className="card border-0">
                            <img src={`http://localhost:4000${video.poster}`} alt={video.name} />
                            <div className="card-body">
                                <p>{video.name}</p>
                                <p>{video.duration}</p>
                            </div>
                        </div>
                    </Link>
                </div>
              )}
          </div>
      </div>
      <Footer />
  </div>
  )
};

export default Home;
