import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this
import homeImage from '../assets/home.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // Hook to navigate

  const handleFindCenter = () => {
    navigate('/findcenter'); // Navigate to FindCenter page
  };

  return (
    <>
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>SAVE LIVES WITH <span>BLOOD DONATION</span></h1>
              <p className="hero-description">
                Every blood donation is a lifesaving gift. Join our community of heroes who make a difference.
              </p>
              
              <div className="hero-cta">
                <button 
                  className="cta-button primary" 
                  onClick={handleFindCenter} // Button click
                >
                  Find a Center
                </button>
                <button className="cta-button secondary">Learn More</button>
              </div>
            </div>
            
            <div className="hero-image-container">
              <img 
                src={homeImage} 
                alt="Blood donation hero" 
                className="hero-image"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Monthly Donations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Centers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Lives Saved</div>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <h2 className="section-title">Why Donate Blood?</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="card-icon">❤️</div>
              <h3>Saves Lives</h3>
              <p>Help accident victims, surgery patients, and those with blood disorders.</p>
            </div>
            
            <div className="benefit-card">
              <div className="card-icon">💪</div>
              <h3>Health Benefits</h3>
              <p>Reduces iron overload and stimulates blood cell production.</p>
            </div>
            
            <div className="benefit-card">
              <div className="card-icon">🤝</div>
              <h3>Community</h3>
              <p>Make a direct impact in your local community.</p>
            </div>
          </div>
        </section>

        <div className="mobile-floating-cta">
          <button className="floating-cta-button">Donate Now</button>
        </div>
      </main>
    </>
  );
};

export default Home;
