import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

import {
  getFirestore,
  query,
  where,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  limit,
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

export const login = ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const logout = () => {
  return signOut(auth);
};

export const employeePinLogin = async (employeeSelected, pin) => {
  try {
    const q = query(collection(db, "employees"));
    const collections = await getDocs(q);
    const itemFound = []
    collections.docs.forEach((line) => {
      if((line.data().name === employeeSelected) && (line.data().pin === pin)){
        itemFound.push(line.data())
      }
    })
    return (itemFound)
    
  } catch (error) {
    console.log("Error logging employee with pin, error: " + error);
  }
}

export const updateUserProfile = async(name, displayNameInput) => {
  if(displayNameInput){
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      alert("Nombre actualizado")
    }).catch((error) => {
      alert("Ha ocurrido un error actualizando tu nombre")
    });
  }
}

export const fetchDeliveryNote = async(reviewFileNumber) => {
  try {
    const q = query(collection(db, reviewFileNumber));
    const collections = await getDocs(q);
    return collections.docs.map(doc => doc.data());
  } catch (error) {
    console.log("An error occured while fetching file data: " + error);
  }
}

export const updateItem = async (item, newUnits, newCheck, incidents, reviewFileNumber, notes, displayName) => {
  try {
    const itemRef = doc(db, reviewFileNumber, item.code)
    if(item.notes){ //For newer documents with "notes" field
      updateDoc(itemRef, {
        unitsReceived: newUnits, 
        checked: newCheck, 
        incidents: incidents, 
        notes: notes, 
        checkedby: displayName
      })
    }else{ //For old documents created before adding the "notes" field
      updateDoc(itemRef, {
        unitsReceived: newUnits, 
        checked: newCheck, 
        incidents: incidents,  
        checkedby: displayName
      })
    }
    return true
  } catch (error) {
    console.log("Error updating the item, error: " + error);
  }
};

function removedDuplicates(arr){
  return arr.filter((item, index) => arr.indexOf(item) === index)
}

export const loadFile = async(fileNumber, content, datePicked) => {
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
      createFile(fileNumber, filteredData, datePicked)
      return filteredData
    }
  } catch (error) {
    console.log(error)
  }
}

export const createFile = async (fileNumber, filteredData, datePicked) => {
  try {
    filteredData.forEach((item) => {
      setDoc(doc(db, fileNumber, item[0]),{
        code: item[0],
        description: item[1],
        barcode: item[2],
        unitsBilled: item[5],
        unitsReceived: 0,
        incidents: false,
        checked: false,
        checkedby: "",
        notes: "",
        time: datePicked
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const addToListOfCollections = async (fileNumber, fileDescription, datePicked) => {
  try {
      setDoc(doc(db, "listOfCollections", fileNumber),{
        number: fileNumber,
        description: fileDescription,
        incidents: false,
        completed: false,
        visible: true,
        createdDate: datePicked
      });
      return true
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

export const updateCompleted = async(fileNumber, completed) => {
  try {
    const fileRef = doc(db, "listOfCollections",fileNumber)
    updateDoc(fileRef, {completed: !completed})
    return true
  } catch (error) {
    console.log("Error updating the item, error: " + error);
  }
}

export const updateFile = async(fileNumber, incidents, completed, visible) => {
  const fileRef = doc(db, "listOfCollections",fileNumber)
  if(fileRef){
    updateDoc(fileRef, {
      incidents: incidents,
      completed: completed,
      visible: visible
    })
    return true
  }
}


export const listAllFiles = async (visible) => {
  try {
    const q = query(collection(db, "listOfCollections"), where("visible", "==", visible));
    const collections = await getDocs(q);
    return collections.docs.map(doc => doc.data());
  } catch (error) {
    console.log("Error listing all the files")
  }
}

export const fetchVisibleFiles = async() => {
  try {
    const visibleFiles = []

    const q = query(collection(db, "listOfCollections"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      visibleFiles.push(doc.data())
    });
    return visibleFiles
  } catch (error) {
    console.log("Error fetching visible files: " + error);
  }
}

export const fetchAllEmployees = async () => {
  try {
    const q = query(collection(db, "employees"));
    const collections = await getDocs(q);
    return collections.docs.map(doc => doc.data());
  } catch (error) {
    console.log("Error listing all the employees")
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
    const querySnapshot = await getDocs(collection(db, fileNumber));

    querySnapshot.forEach((item) => {
      const itemRef = doc(db, fileNumber, item.data().code)
      deleteDoc(itemRef)
    });
    return true
  } catch (error) {
    console.log("Error deleting the item, error: " + error);
  }
}