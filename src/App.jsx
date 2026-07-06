import React from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App">
      {/* For now, we render the LandingPage directly so you can see your navbar. 
          Once we add routing later, we can map these to paths! */}
      <LandingPage />
    </div>
  );
}

export default App;