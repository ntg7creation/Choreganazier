// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import * as docFormat from "./documentsFormat.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/* ------------------ Your web app's Firebase configuration ----------------- */
const firebaseConfig = {
  apiKey: "AIzaSyA93J4aeGmegg4krzqErg7Bt8ueQHwaoQ0",
  authDomain: "test101-e2b19.firebaseapp.com",
  projectId: "test101-e2b19",
  storageBucket: "test101-e2b19.appspot.com",
  messagingSenderId: "564618201259",
  appId: "1:564618201259:web:1ccfd7670b718bb5a9cfee",
};

/* -------------------------------------------------------------------------- */
/*                             Initialize Firebase                            */
/* -------------------------------------------------------------------------- */
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const provider = new GoogleAuthProvider();
export const auth = getAuth(); // TODO find a way to get rid of export
let docSnap = undefined;
/* -------------------------------------------------------------------------- */
/*                                static values                               */
/* -------------------------------------------------------------------------- */
const TASKS_PATH = "Tasks";
const CREW_PATH = "Crew";
const ACCESSLEVEL1 = 1;
const ACCESSLEVEL2 = 2;
const AccessLevel3 = 3;
/* -------------------------------------------------------------------------- */
/*                                basic actions                               */
/* -------------------------------------------------------------------------- */
onAuthStateChanged(auth, (user) => {
  user
    ? console.log("you are logged in", user)
    : console.log("you are signed out ");
});




export function Login() {
  auth.currentUser
    ? console.log("you are already logged in")
    : signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          console.log(error);
        });
}
export function signOut() {
  auth.signOut();
}



async function checkAction(condition, action) {
  const userID = getMyID();
  if (!userID) {
    // console.error("No valid user ID found, action aborted.");
    return;
  }

  await getSnap(CREW_PATH, getMyID());
  if (condition()) {
    action();
  }
  clearSnap();
}

/* -------------------------------------------------------------------------- */
/*                             basic info getters                             */
/* -------------------------------------------------------------------------- */
function getMyID() {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  } else {
    // console.error("No user is currently logged in.");
    return null;
  }
}
// function getMyID() {
//   return auth.currentUser.uid;
// }

async function getSnap(collection_path, document) {
  docSnap = await getDoc(doc(db, collection_path, document));
  return docSnap;
}

function clearSnap() {
  docSnap = undefined;
}

/* -------------------------------------------------------------------------- */
/*                                 constrainst                                */
/* -------------------------------------------------------------------------- */
async function checkAccessLevel(requiredAccessLevel) {
  if (!docSnap) {
    console.log("no docSnap");
    return false;
  }
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("you have access level: ", data.AccessLevel);
    console.log("you need access level: ", requiredAccessLevel);
    return data.AccessLevel >= requiredAccessLevel;
  } else console.log("No such document!");
  return false;
}

async function checkMyAccessLevel(requiredAccessLevel) {
  await getSnap(CREW_PATH, getMyID());
  if (docSnap.data().AccessLevel >= requiredAccessLevel) {
    return true;
  } else {
    return false;
  }
}
/* -------------------------------------------------------------------------- */
/*                                   actions                                  */
/* -------------------------------------------------------------------------- */
export async function getData(docPath, docName) {
  // checkMyAccessLevel(ACCESSLEVEL1); // TODO the data base will not allow me to read the AccessLevel if I dont have clearnse access
  const docSnap = await getDoc(doc(db, docPath, docName));
  if (!docSnap.exists()) {
    console.log("No such document:", docName, " in ", docPath);
    return;
  }

  return docSnap.data();
  // console.log("Document data:", docSnap.data());
}

export async function getPromiseData(
  docPath,
  docName,
  action = (data) => {
    console.log(data);
  }
) {
  checkAction();
  const docSnap = await getDoc(doc(db, docPath, docName));
  if (!docSnap.exists()) {
    console.log("No such document!");
    return;
  }

  const data = docSnap.data();
  action(data);
}

export async function editField(
  collectionName,
  documentID,
  fieldName,
  newValue
) {
  const requiredAccessLevel = ACCESSLEVEL2;
  // Reference to the document you want to update
  const action = async () => {
    const docRef = doc(db, collectionName, documentID);

    // Create an object with the field to update
    const updateObject = {};
    updateObject[fieldName] = newValue;

    try {
      // Update the document with the new value
      await updateDoc(docRef, updateObject);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  checkAction(() => {
    return checkAccessLevel(requiredAccessLevel);
  }, action);
}

export function getField(
  collectionName,
  documentID,
  fieldName,
  setFunction = undefined
) {
  const action = async () => {
    // Check if the inputs are valid
    if (!collectionName || !documentID || !fieldName || !setFunction) {
      // console.error("Invalid input:", {
      //   collectionName,
      //   documentID,
      //   fieldName,
      //   setFunction,
      // });
      return;
    }

    const docRef = doc(db, collectionName, documentID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("No such document!");
      return;
    }

    const data = docSnap.data();
    // console.log(data[fieldName]);
    setFunction(data[fieldName]);
  };

  checkAction(() => {
    return true;
  }, action);
}

export function logData(collection_path, document) {
  const accessLevelNeeded = ACCESSLEVEL1;
  const text = "Document data:";

  const action = async () => {
    const docSnap = await getDoc(doc(db, collection_path, document));
    if (!docSnap.exists()) {
      console.log("No such document!");
      return;
    }
    const data = docSnap.data();
    // console.log(text, data);
  };

  checkAction(() => {
    return checkAccessLevel(accessLevelNeeded);
  }, action);
}

export function assignSelfToTask(TaskId) {
  const accessLevelNeeded = ACCESSLEVEL1;
  const action = async () => {
    // console.log("starting action");
    const taskRef = doc(db, TASKS_PATH, "task1");
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      console.log("No such document!");
      return;
    }

    const taskData = taskDoc.data();
    // console.log(taskData);

    const AssignedCrew = taskData.AssignedCrew || [];
    const ID = getMyID();

    if (AssignedCrew.includes(ID)) {
      console.log("You are already assigned to this task");
      return;
    }

    if (AssignedCrew.length >= taskData.NumberOfSlots) {
      console.log("No slots left");
      return;
    }

    AssignedCrew.push(ID);
    await setDoc(taskRef, { AssignedCrew }, { merge: true });
  };

  checkAction(() => {
    return checkAccessLevel(accessLevelNeeded);
  }, action);
}

export function AddCrewMember(crewMemberID, crewMemberDoc) {
  const accessLevelNeeded = ACCESSLEVEL2;
  const action = async () => {
    const ID = crewMemberID;
    const newDocRef = doc(db, CREW_PATH, ID);
    await setDoc(newDocRef, crewMemberDoc);
  };

  checkAction(() => {
    return checkAccessLevel(accessLevelNeeded);
  }, action);
}

export function DeleteCrewMember(crewMemberID) {
  const accessLevelNeeded = ACCESSLEVEL2;
  const action = async () => {
    const ID = crewMemberID;
    const docRef = doc(db, CREW_PATH, ID);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      console.log(`Document with ID ${ID} successfully deleted.`);
    } else {
      console.log(`No document found with ID ${ID}.`);
    }

    await deleteDoc(docRef);
  };
  checkAction(() => {
    return checkAccessLevel(accessLevelNeeded);
  }, action);
}

export function DeleteTask(taskName) {
  const accessLevelNeeded = ACCESSLEVEL2;
  const action = async () => {
    const ID = taskName;
    const docRef = doc(db, TASKS_PATH, ID);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      console.log(`Document with ID ${ID} successfully deleted.`);
    } else {
      console.log(`No document found with ID ${ID}.`);
    }

    await deleteDoc(docRef);
  };
  checkAction(() => {
    return checkAccessLevel(accessLevelNeeded);
  }, action);
}

export function AddTask(TaskName = "task3", data) {
  const accessLevelNeeded = ACCESSLEVEL2;
  const action = async () => {
    await getSnap(TASKS_PATH, TaskName);
    if (docSnap.exists()) {
      console.log("task already exists");
      clearSnap();
      return;
    }

    console.log("adding task: ", TaskName, data);
    const newDocRef = doc(db, TASKS_PATH, TaskName);
    await setDoc(newDocRef, data);
  };

  checkAction(() => {
    return checkAccessLevel(accessLevelNeeded);
  }, action);
}

/* -------------------------------------------------------------------------- */
// ! Not in use
function CopyCrewMember() {
  const action = async () => {
    const docRef = doc(db, "Crew", "TRalT0QzkBoRRKt6VgAo");
    const docSnapshot = await getDoc(docRef);
    const docData = docSnapshot.data();
    const ID = getMyID();
    console.log("IDL : ", ID);
    const newDocRef = doc(db, "Crew", ID);
    console.log("doc ref:", newDocRef);
    console.log("doc data:", docData);
    await setDoc(newDocRef, docData);
  };

  checkAction(() => {
    return checkAccessLevel(ACCESSLEVEL2);
  }, action);
}
