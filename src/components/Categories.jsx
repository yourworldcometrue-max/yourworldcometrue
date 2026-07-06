import React from 'react';
import '../styles/categories.css';

// Import all 7 interactive category images
import shopImg from '../assets/categories/shop.jpg';
import travelImg from '../assets/categories/travel.jpg';
import foodImg from '../assets/categories/food.jpg';
import healthImg from '../assets/categories/health.jpg';
import educationImg from '../assets/categories/education.jpg';
import newsImg from '../assets/categories/news.jpg';
import financeImg from '../assets/categories/finance.jpg';

const categoryData = [
  { id: 1, title: 'Shop Smart', desc: 'Best deals. Trusted products.', img: shopImg, link: '/shop', isPromo: false },
  { id: 2, title: 'Travel More', desc: 'Explore new places. Create memories.', img: travelImg, link: '/travel', isPromo: false },
  { id: 3, title: 'Eat Healthy', desc: 'Tasty recipes. Healthy living.', img: foodImg, link: '/food', isPromo: false },
  { id: 4, title: 'Live Better', desc: 'Health tips. Fitness. Wellness.', img: healthImg, link: '/health', isPromo: false },
  { id: 5, title: 'Learn & Grow', desc: 'Education. Jobs. Skills for your future.', img: educationImg, link: '/education', isPromo: false },
  { id: 6, title: 'Stay Informed', desc: 'News. Updates. What matters to you.', img: newsImg, link: '/news', isPromo: false },
  { id: 7, title: 'Manage Finances', desc: 'Smart money. Secure future.', img: financeImg, link: '/finance', isPromo: false },
  // 8th Item: Dynamic Promo Card to clear the mobile white gap space completely
  { id: 8, title: 'Your World', desc: 'Everything you need. All in one place.', img: null, link: '/signup', isPromo: true }
];

const Categories = () => {
  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categoryData.map((item) => {
          if (item.isPromo) {
            return (
              <a href={item.link} className="category-card promo-card" key={item.id}>
                <div className="promo-content">
                  <div className="promo-badge">NEW</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="promo-btn">Get Started →</span>
                </div>
              </a>
            );
          }

          return (
            <a href={item.link} className="category-card" key={item.id}>
              <div className="card-image-wrapper">
                <img src={item.img} alt={item.title} className="category-img" />
                <div className="card-overlay"></div>
              </div>
              <div className="card-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;