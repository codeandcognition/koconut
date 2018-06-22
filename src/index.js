import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/koconut/containers/App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';

var config = {
    apiKey: "AIzaSyBjPZISUiRSL2npF06gg1ZQbWOaOOHpQSY",
    authDomain: "cyberlearning-1d4e0.firebaseapp.com",
    databaseURL: "https://cyberlearning-1d4e0.firebaseio.com",
    projectId: "cyberlearning-1d4e0",
    storageBucket: "cyberlearning-1d4e0.appspot.com",
    messagingSenderId: "442084105931"
  };
firebase.initializeApp(config);

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
