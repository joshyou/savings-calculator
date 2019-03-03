//firebase config

import app from 'firebase/app';

var config = {
    apiKey: "AIzaSyCk5EjETCDHcJ-OtYGLr4DYHJukqJS1i7A",
    authDomain: "savings-calculator-1251a.firebaseapp.com",
    databaseURL: "https://savings-calculator-1251a.firebaseio.com",
    projectId: "savings-calculator-1251a",
    storageBucket: "savings-calculator-1251a.appspot.com",
    messagingSenderId: "54993090529"
};

class Firebase {
    constructor() {
      app.initializeApp(config);
    }
  }
  
export default Firebase;