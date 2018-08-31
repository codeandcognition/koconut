import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/koconut/containers/App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';


var config = {
    apiKey: "AIzaSyBjPZISUiRSL2npF06gg1ZQbWOaOOHpQSY",
    authDomain: "cyberlearning-1d4e0.firebaseapp.com",
    databaseURL: "https://cyberlearning-1d4e0.firebaseio.com",
    projectId: "cyberlearning-1d4e0",
    storageBucket: "cyberlearning-1d4e0.appspot.com",
    messagingSenderId: "442084105931"
  };
firebase.initializeApp(config);


window.addEventListener('beforeunload', e => {
  e.preventDefault();
  let user = firebase.auth().currentUser;
  let uid = user?user.uid:null
  if(uid) {
    firebase.database().ref(`/Users/${uid}/Data/SessionEvents`).push({
      type: "end",
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }
})

ReactDOM.render(<App firebase={firebase}/>, document.getElementById('root'));
registerServiceWorker();
