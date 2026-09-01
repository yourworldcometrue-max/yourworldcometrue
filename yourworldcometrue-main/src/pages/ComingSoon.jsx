import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/coming-soon.css';

export default function ComingSoon({ category, description }) {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="page-main">
        <section className="coming-soon-section container">
          <p className="section-eyebrow">Under construction</p>
          <h1>{category}</h1>
          <p className="coming-soon-desc">{description}</p>
          <Link to="/" className="btn btn-primary btn-lg">Back to home</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
