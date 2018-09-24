import firebase from 'firebase'
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBZLRfylo8XEPQM72hMXENcVZgDuMR0NiI",
    authDomain: "revents-215209.firebaseapp.com",
    databaseURL: "https://revents-215209.firebaseio.com",
    projectId: "revents-215209",
    storageBucket: "revents-215209.appspot.com",
    messagingSenderId: "988106357553"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}

firestore.settings(settings)

export default firebase;