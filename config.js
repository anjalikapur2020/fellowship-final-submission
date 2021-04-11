import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCBAA8cnkQ9ETuxVogwSgkALcNGFdnb1d0",
  authDomain: "fellowship-e49c9.firebaseapp.com",
  databaseURL: "https://fellowship-e49c9-default-rtdb.firebaseio.com",
  projectId: "fellowship-e49c9",
  storageBucket: "fellowship-e49c9.appspot.com",
  messagingSenderId: "860840665580",
  appId: "1:860840665580:web:4d84896f8bf9bb9455e0c9"
};

// Initialize Firebase

if(!firebase.apps.length)
{firebase.initializeApp(firebaseConfig)}

export default firebase.firestore();

