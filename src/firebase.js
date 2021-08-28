import firebase from 'firebase';
const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyCbwAEPSbK85NGvo3kyiid1gaZTLUORJqo",
    authDomain: "instagram-clone-4b1a1.firebaseapp.com",
    projectId: "instagram-clone-4b1a1",
    storageBucket: "instagram-clone-4b1a1.appspot.com",
    messagingSenderId: "231460226774",
    appId: "1:231460226774:web:3706727c0a9550da13eb77",
    measurementId: "G-N6MV272YSD"
});
const db=firebaseApp.firestore()
const auth=firebase.auth()
const storage=firebase.storage()
export {db,auth,storage}