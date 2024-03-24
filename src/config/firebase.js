import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

import {
  getFirestore,
  query,
  where,
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

import "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export const logout = () => {
  return signOut(auth);
};

function removedDuplicates(arr){
  return arr.filter((item, index) => arr.indexOf(item) === index)
}

export const fetchReviewFiles = async(reviewFileNumber) => {
  try {
    const files = await getDocs(collection(db, reviewFileNumber));
    var data = [];
    files.forEach((item) => {
      data.push(item.data());
    });
    return data;
  } catch (error) {
    console.log("An error occured while fetching file data: " + error);
  }
}

export const updateItem = async (item, newCheck, reviewFileNumber) => {
  try {
    const q = query(collection(db, reviewFileNumber), where("code", "==", item.code));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((line) => {
      const itemRef = doc(db, reviewFileNumber, item.code)
      updateDoc(itemRef, {checked: newCheck})
    });

    return fetchReviewFiles(reviewFileNumber)
  } catch (error) {
    console.log("Error updating the item, error: " + error);
  }
};

export const loadFile = async(filename, content) => {
  const filteredData = []

  try {
    if(content){
      var separatedLines = content.split(/\r?\n|\r|\n/g);
      const finalLines = removedDuplicates(separatedLines)
    
      finalLines.forEach((element, index) => {
        let linesCounter = separatedLines.filter(x => x==element).length
        const item = element.split("$")
        item.push(linesCounter)
        filteredData.push(item)
      })
      createFile( filename,filteredData)
      return filteredData
    }
  } catch (error) {
    console.log(error)
  }
}


export const createFile = async (filename, lines) => {
  try {
    lines.forEach((item) => {
      console.log("Adding items to the database...");
      // addDoc(collection(db, filename), {
      setDoc(doc(db, filename, item[0]),{
        code: item[0],
        description: item[1],
        barcode: item[2],
        units: item[5],
        checked: false,
        checkedby: "",
        time: ""
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const ListAllFiles = async () => {
  let filesList = []
  try {
    const q = query(collection(db, "listOfCollections"));
    const collections = await getDocs(q);
    collections.forEach(async (item) => {
      filesList.push(item.data().number)
    });
    return filesList
  } catch (error) {
    
  }
}