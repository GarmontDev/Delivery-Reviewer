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
  deleteDoc,
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

export const updateItem = async (item, newUnits, newCheck, reviewFileNumber) => {
  try {
    const q = query(collection(db, reviewFileNumber), where("code", "==", item.code));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((line) => {
      const itemRef = doc(db, reviewFileNumber, item.code)
      updateDoc(itemRef, {"unitsReceived": newUnits, "checked": newCheck})
    });

    return fetchReviewFiles(reviewFileNumber)
  } catch (error) {
    console.log("Error updating the item, error: " + error);
  }
};

export const loadFile = async(fileNumber, content) => {
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
      createFile(fileNumber, filteredData)
      return filteredData
    }
  } catch (error) {
    console.log(error)
  }
}


export const createFile = async (fileNumber, lines) => {
  try {
    lines.forEach((item) => {
      console.log("Adding items to the database...");
      // addDoc(collection(db, filename), {
      setDoc(doc(db, fileNumber, item[0]),{
        code: item[0],
        description: item[1],
        barcode: item[2],
        unitsBilled: item[5],
        unitsReceived: 0,
        checked: false,
        checkedby: "",
        time: ""
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const addToListOfCollections = async (fileNumber, fileDescription) => {
  try {
      console.log("Adding to list of collections...");
      setDoc(doc(db, "listOfCollections", fileNumber),{
        number: fileNumber,
        description: fileDescription,
      });
      return true
  } catch (error) {
    console.log(error);
  }
};

export const ListAllFiles = async () => {
  try {
    const q = query(collection(db, "listOfCollections"));
    const collections = await getDocs(q);
    return collections.docs.map(doc => doc.data());
  } catch (error) {
    console.log("Error listing all the files")
  }
}

export const deleteFileFromCollections = async (fileNumber) => {
  try {
    const q = query(collection(db, "listOfCollections"), where("number", "==", fileNumber));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((line) => {
      const itemRef = doc(db, "listOfCollections", fileNumber)
      deleteDoc(itemRef)
    });
    return true
  } catch (error) {
    console.log("Error deleting the item, error: " + error);
  }
}

export const deleteFile = async (fileNumber) => {
  try {
    const q = query(collection(db, "listOfCollections"));
    const collections = await getDocs(q);
    collections.docs.forEach((line) => {
      const itemRef = doc(db, fileNumber, line)
      deleteDoc(itemRef)
    });
    return true
  } catch (error) {
    console.log("Error deleting the item, error: " + error);
  }
}