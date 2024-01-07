import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Controler from './MVC/Controler';

// NOTE: I know this is NOT how you use react, but it was easier for me to do it this way and the focus of this project wasn't on React.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const controler = new Controler();
