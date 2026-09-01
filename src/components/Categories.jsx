import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/categories.css';

import shopImg from '../assets/categories/shop.jpg';
import travelImg from '../assets/categories/travel.jpg';
import foodImg from '../assets/categories/food.jpg';
import healthImg from '../assets/categories/health.jpg';
import educationImg from '../assets/categories/education.jpg';
import newsImg from '../assets/categories/news.jpg';
import financeImg from '../assets/categories/finance.jpg';
import dealsImg from '../assets/categories/deals.jpg';

const categoryData = [
  { id: 1, title: 'Shop Smart', desc: 'Best deals. Trusted sellers.', img: shopImg, to: '/shop' },
  { id: 2, title: 'Travel More', desc: 'Explore new places.', img: travelImg, to: '/travel', video: true },
  { id: 3, title: 'Eat Healthy', desc: 'Tasty, healthy recipes.', img: foodImg, to: '/food' },
  { id: 4, title: 'Live Better', desc: 'Fitness & wellness.', img: healthImg, to: '/health' },
  { id: 5, title: 'Learn & Grow', desc: 'Skills for your future.', img: educationImg, to: '/education' },
  { id: 6, title: 'Stay Informed', desc: 'News that matters.', img: newsImg, to: '/news' },
  { id: 7, title: 'Manage Finances', desc: 'Smart money moves.', img: financeImg, to: '/finance' },
  { id: 8, title: 'Offers & Deals', desc: 'Limited-time offers.', img: dealsImg, to: '/deals' },
];

const Categories = ({ onTravelClick }) => {
  return (
    <section className="categories-section">
      <div className="container">
        <p className="section-eyebrow">An atlas of your world</p>
        <h2 className="section-title">Pick where you're headed</h2>
      </div>

      <div className="categories-track container">
        {categoryData.map((item) => (
          <Link
            to={item.to}
            className="category-card"
            key={item.id}
            onClick={(e) => {
              if (item.video && onTravelClick) {
                e.preventDefault();
                onTravelClick();
              }
            }}
          >
            <div className="category-image-wrapper">
              <img src={item.img} alt="" className="category-img" loading="lazy" />
              <div className="category-overlay" />
            </div>
            <div className="category-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
