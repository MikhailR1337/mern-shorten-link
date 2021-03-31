import React from 'react';
import { Loader } from '../src/components/Loader'
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/authHook';
import { AuthContext } from './context/AuthContext';
import { NavBar } from './components/NavBar';
import 'materialize-css';

function App() {
  const { token, login, logout, userId, ready} = useAuth()
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
    <Router>
      { isAuthenticated && <NavBar />}
      <div className="container">
        {routes}
      </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
