import React from 'react';
import '../styles/categories.css';

// Import all 8 interactive category images
import shopImg from '../assets/categories/shop.jpg';
import travelImg from '../assets/categories/travel.jpg';
import foodImg from '../assets/categories/food.jpg';
import healthImg from '../assets/categories/health.jpg';
import educationImg from '../assets/categories/education.jpg';
import newsImg from '../assets/categories/news.jpg';
import financeImg from '../assets/categories/finance.jpg';
import dealsImg from '../assets/categories/deals.jpg'; // Make sure to add this image!

const categoryData = [
  { id: 1, title: 'Shop Smart', desc: 'Best deals. Trusted products.', img: shopImg, link: '/shop' },
  { id: 2, title: 'Travel More', desc: 'Explore new places. Create memories.', img: travelImg, link: '/travel' },
  { id: 3, title: 'Eat Healthy', desc: 'Tasty recipes. Healthy living.', img: foodImg, link: '/food' },
  { id: 4, title: 'Live Better', desc: 'Health tips. Fitness. Wellness.', img: healthImg, link: '/health' },
  { id: 5, title: 'Learn & Grow', desc: 'Education. Jobs. Skills for your future.', img: educationImg, link: '/education' },
  { id: 6, title: 'Stay Informed', desc: 'News. Updates. What matters to you.', img: newsImg, link: '/news' },
  { id: 7, title: 'Manage Finances', desc: 'Smart money. Secure future.', img: financeImg, link: '/finance' },
  { id: 8, title: 'Offers & Deals', desc: 'Best discounts. Limited time offers.', img: dealsImg, link: '/deals' },
];

const Categories = ({ onTravelClick }) => {
  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categoryData.map((item) => (
          <a 
            href={item.link} 
            className="category-card" 
            key={item.id}
            onClick={(e) => {
              // If it's the 2nd card (Travel More), stop page redirect and play the video popup instead
              if (item.id === 2 && onTravelClick) {
                e.preventDefault();
                onTravelClick();
              }
            }}
          >
            <div className="card-image-wrapper">
              <img src={item.img} alt={item.title} className="category-img" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Categories;