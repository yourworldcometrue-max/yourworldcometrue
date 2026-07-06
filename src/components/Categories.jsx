import React from 'react';
import '../styles/categories.css';

// Import all 7 category images
import shopImg from '../assets/categories/shop.jpg';
import travelImg from '../assets/categories/travel.jpg';
import foodImg from '../assets/categories/food.jpg';
import healthImg from '../assets/categories/health.jpg';
import educationImg from '../assets/categories/education.jpg';
import newsImg from '../assets/categories/news.jpg';
import financeImg from '../assets/categories/finance.jpg';

const categoryData = [
  { id: 1, title: 'Shop Smart', desc: 'Best deals. Trusted products.', img: shopImg, link: '/shop' },
  { id: 2, title: 'Travel More', desc: 'Explore new places. Create memories.', img: travelImg, link: '/travel' },
  { id: 3, title: 'Eat Healthy', desc: 'Tasty recipes. Healthy living.', img: foodImg, link: '/food' },
  { id: 4, title: 'Live Better', desc: 'Health tips. Fitness. Wellness.', img: healthImg, link: '/health' },
  { id: 5, title: 'Learn & Grow', desc: 'Education. Jobs. Skills for your future.', img: educationImg, link: '/education' },
  { id: 6, title: 'Stay Informed', desc: 'News. Updates. What matters to you.', img: newsImg, link: '/news' },
  { id: 7, title: 'Manage Finances', desc: 'Smart money. Secure future.', img: financeImg, link: '/finance' },
];

const Categories = () => {
  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categoryData.map((item) => (
          <a href={item.link} className="category-card" key={item.id}>
            {/* Image Wrapper for Zoom/Highlight effect */}
            <div className="card-image-wrapper">
              <img src={item.img} alt={item.title} className="category-img" />
              <div className="card-overlay"></div>
            </div>
            
            {/* Text Content Overlay at bottom */}
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