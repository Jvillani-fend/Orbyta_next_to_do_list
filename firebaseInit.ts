import firebase from "firebase/compat/app";
import { firebaseConfig } from "./firebaseConfig";
import "firebase/compat/database";
firebase.initializeApp(firebaseConfig)

export const database = firebase.database() 

export default firebase