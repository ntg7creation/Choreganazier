import * as FireBase from "./fireBaseCom";
import { GeoPoint } from "firebase/firestore";
import { createTaskData } from "../DataCom/documentsFormat";
// import demoCrewMember from "./demoCrewMember.json";
/* ----------------------------- Captin Actions ----------------------------- */
export function addCrewMember(id, crewdata) {
  // const CrewData = demoCrewMember[demoCrewMember];
  //TODO fill id and data
  fetch("./DataCom/demoCrewMember.json")
    .then((response) => response.json())
    .then((data) => {
      FireBase.AddCrewMember("tempID", data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

export function deleteCrewMember(id) {
  FireBase.DeleteCrewMember("tempID");
}

export function addTask(taskName) {
  //TODO fill in currect data
  fetch("./DataCom/demoTask.json")
    .then((response) => response.json())
    .then((data) => {
      data.TimeStart = new Date(data.TimeStart);
      data.Location = new GeoPoint(
        data.Location.latitude,
        data.Location.longitude
      );
      FireBase.AddTask(taskName, data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

export function editTask(taskname) {
  FireBase.editField("Tasks", "taskname", "NumberOfSlots", 5);
}

export function deleteTask(taskname) {
  //TODO
  FireBase.DeleteTask("testTask2");
}

/* ------------------------------ Crew Actions ------------------------------ */
export function editSelf() {
  //TODO
}

export function getAuthenticated() {
  // console.log("getAuthenticated");
  FireBase.Login();
}
export function signOut() {
  FireBase.signOut();
}
export function displayData() {
  FireBase.displayData("Crew", "ZFJNKht1sXWmyhGsH9z1fO3MyZz1");
}

export function assignSelfToTask(TaskId) {
  TaskId = "task1"; // TODO: get task id from UI
  FireBase.assignSelfToTask(TaskId);
}

export function checkAccessLevel() {}

/* ----------------------------------- dev ---------------------------------- */

export function tempButton() {
  // deleteCrewMember();
  // addCrewMember();
  // addTask("testTask2");
  // deleteTask();
  editTask();
}
