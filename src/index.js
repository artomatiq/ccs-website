import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places']
const googleMapsPublicKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadScript googleMapsApiKey={googleMapsPublicKey} libraries={libraries}>
        <App />
      </LoadScript>
    </BrowserRouter>
  </React.StrictMode>
);