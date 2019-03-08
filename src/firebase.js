//firebase config

import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCk5EjETCDHcJ-OtYGLr4DYHJukqJS1i7A",
    authDomain: "savings-calculator-1251a.firebaseapp.com",
    databaseURL: "https://savings-calculator-1251a.firebaseio.com",
    projectId: "savings-calculator-1251a",
    storageBucket: "savings-calculator-1251a.appspot.com",
    messagingSenderId: "54993090529"
};

firebase.initializeApp(config);

export default firebase;