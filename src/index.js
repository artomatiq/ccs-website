import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { AuthProvider } from './auth/AuthContext';

const libraries = ['places']
const googleMapsPublicKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LoadScript
          googleMapsApiKey={googleMapsPublicKey}
          libraries={libraries}
        >
          <App />
        </LoadScript>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);