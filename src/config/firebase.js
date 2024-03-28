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

export const updateItem = async (item, newUnits, newCheck, incidents, reviewFileNumber, email) => {
  try {
    const itemRef = doc(db, reviewFileNumber, item.code)
    updateDoc(itemRef, {unitsReceived: newUnits, checked: newCheck, incidents: incidents, checkedby: email})

    return fetchReviewFiles(reviewFileNumber)
  } catch (error) {
    console.log("Error updating the item, error: " + error);
  }
};

function removedDuplicates(arr){
  return arr.filter((item, index) => arr.indexOf(item) === index)
}

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
      setDoc(doc(db, fileNumber, item[0]),{
        code: item[0],
        description: item[1],
        barcode: item[2],
        unitsBilled: item[5],
        unitsReceived: 0,
        incidents: false,
        checked: false,
        checkedby: "",
        time: ""
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateIncidents = async(fileNumber) => {
  try {
    const incidentsFound = []

    const q = query(collection(db, fileNumber), where("incidents", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      incidentsFound.push(doc.data())
    });
    if(incidentsFound.length > 0){
      const fileRef = doc(db, "listOfCollections",fileNumber)
      updateDoc(fileRef, {incidents: true})
      return true
    }else{
      const fileRef = doc(db, "listOfCollections",fileNumber)
      updateDoc(fileRef, {incidents: false})
      return false
    }
  } catch (error) {
    console.log("Error updating the item, error: " + error);
  }
}

export const addToListOfCollections = async (fileNumber, fileDescription) => {
  try {
      console.log("Adding to list of collections...");
      setDoc(doc(db, "listOfCollections", fileNumber),{
        number: fileNumber,
        description: fileDescription,
        incidents: false,
        completed: false,
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

//TODO it does not delete the lines
export const deleteFile = async (fileNumber) => {
  try {
    const q = query(collection(db, "listOfCollections"));
    const collections = await getDocs(q);
    collections.docs.forEach((line) => {
      const itemRef = doc(db, fileNumber, line.data().number)
      deleteDoc(itemRef)
    });
    return true
  } catch (error) {
    console.log("Error deleting the item, error: " + error);
  }
}