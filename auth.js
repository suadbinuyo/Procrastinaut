import { initializeApp } from  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs, deleteDoc, query, orderBy, where, serverTimestamp } from  "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

 

const firebaseConfig = {
  apiKey: "AIzaSyBdDUUJKgBgSyV6bL9Qrw93BWzjEODZjtI",
  authDomain: "first-project-dc60b.firebaseapp.com",
  projectId: "first-project-dc60b",
  storageBucket: "first-project-dc60b.firebasestorage.app",
  messagingSenderId: "692391873078",
  appId: "1:692391873078:web:12ec161a69cbee938a2697",
  measurementId: "G-8WM43P61Z6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app)
 const db = getFirestore(app);
 const auth = getAuth(app);

 // initialising app stuff


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

 onAuthStateChanged(auth, (user) =>{
  const logoutButton = document.querySelector(".logout-button");
  const loginButton = document.getElementById("login-btn");
  const signup = document.getElementById("signup-btn");


  if (user){
    //console.log("user logged in: ", user);
    showPopup("Successfully logged in!");


    logoutButton.style.display = "block";
    loginButton.style.display ="none";
    signup.style.display = "none";
    
  }
  else{
    //console.log("user logged out");
    showPopup("Successfully logged out!");
     logoutButton.style.display = "none";
     loginButton.style.display ="block";
     signup.style.display = "block";
     
  }
 

 });



 function showPopup(message){
  let popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.backgroundColor = "#634a95";
  popup.style.color = "white";
  popup.style.padding = "15px 20px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0px 4px 6px rgba (0,0,0,0.1)";
  popup.style.fontSize = "16px";
  popup.style.opacity = "0";
  popup.style.transform = "translateY(-20px)";
  popup.style.transition = "opacity 0.3 ease-out";
  popup.style.zIndex = "1000";
  



  popup.innerHTML = message + '<span style="margin-left: 15px; cursor:pointer; font-weight: bold;"  class="close-btn" onclick="this.parentElement.remove()">&times;</span>';


  document.body.appendChild(popup);

  setTimeout(() =>{
    popup.style.opacity = "1";
    popup.style.transform = "translateY(0)";
  }, 100);


  setTimeout(()=>{ // hide after 3 sec
    popup.style.opacity = "1";
    popup.style.transform = "translateY(-20px)";

    setTimeout(()=> popup.remove(), 300); // remove from html
  }, 1000);

 }


  
  
   document.addEventListener("DOMContentLoaded", () =>{

    const signupForm = document.querySelector('#signup-form');
    const loginForm = document.querySelector("#login-form");
  


    //sign up users

signupForm.addEventListener("submit", (e) =>{
  e.preventDefault(); // prevents info from being lost after clicking sign up (refreshing)

  // getting user info
  const email = signupForm["signup-email"].value
  const password = signupForm["signup-password"].value


  if (password.length < 6){ // if pass len < 6
    showPopup("Password must be at least 6 characters.\nPlease try again");
  }
  if (email.slice(-4,)!= ".com"){
    showPopup("Please enter valid email!");
  }

  // sign up the user
  
  createUserWithEmailAndPassword(auth, email, password).then(async cred =>{
    const user = cred.user;  
  
    await setDoc(doc(db, "users", user.uid),{
          uid: user.uid,
          email: email,
          createdAt: new Date()
      });
    

      console.log("user signed up and saved in firestore");
      showPopup("Successfully logged in!");
    
    
      const modal = document.querySelector("#signup-modal");
      modal.classList.remove("show"); // closing modal
      

      signupForm.reset(); // resetting form
  })

});

 // logout

 logout.addEventListener("click", (e) =>{
   e.preventDefault();
   
   signOut(auth).then(()=>{
     showPopup("Successfully logged out !");
   });
  
 });


 // logging in
 loginForm.addEventListener("submit", (e)=>{
   e.preventDefault();


   // getting the user info
   const email = loginForm["login-email"].value;
   const password = loginForm["login-password"].value;

   signInWithEmailAndPassword(auth, email, password).then(cred =>{

    // closing login modal and resetting
     const modal = document.querySelector("#login-modal");
      modal.classList.remove("show"); // closing modal
      loginForm.reset(); // resetting form
  });




 });
  
   });


   
     


    //storing info from todolist to database

document.addEventListener("DOMContentLoaded", ()=>{
    const taskInput = document.getElementById("taskInput");
    const listContainer = document.getElementById("tasksContainer");
    const addTaskButton = document.querySelector(".toDoListBtn");


    async function addTask() {
        const user = auth.currentUser;
        if(!user){
          showPopup("You must be logged in to add tasks!");
          return;
        }


        if(taskInput.value.trim()=== ""){
          showPopup("Please add a task !");
          return;
        }

        try{

          await addDoc(collection(db, "users", user.uid, "tasks"),{
            task: taskInput.value.trim(),
            completed: false,
            createdAt: new Date()
          });


          showPopup("task added successfully");
          taskInput.value = ""; // clear input after adding task
          loadTasks(); // loads taks 
        } catch (error){
          showPopup("Error loading tasks. Please try again");
        }
      
    }

    // loads tasks from firestore
    async function loadTasks() {
      const user = auth.currentUser;
      if(!user){
        return;
      }

      listContainer.innerHTML= ""; // clear before fetching

      try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "tasks"));
        querySnapshot.forEach((doc) => {
          createTaskElement(doc.id, doc.data().task);
        });
      } catch (error){
        showPopup("Error loading tasks. Please try again!");
      }
      
    }

    // function tthat creates tasks elements

    function createTaskElement(taskId, taskTest){
      let li = document.createElement("li");
      li.textContent = taskTest;


      // tasks that have been completed 
      listContainer.addEventListener("click", function(e){
        if(e.target.tagName === "LI"){
            e.target.classList.toggle("checked");
            
        }
       
    }, false);


      // delete button
      let span = document.createElement("span");
      span.innerHTML = "\u00d7";
      span.addEventListener("click", async () =>{
        try {
          const user = auth.currentUser;
          if(!user){
            return;
          }


          await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
          showPopup("Task deleted successfully");
          loadTasks();



        } catch (error){
          showPopup("Error deleting task. Please try again !");
        }
      });

      li.appendChild(span);
      listContainer.appendChild(li);
    }

    onAuthStateChanged(auth, (user) =>{
      if (user){
        loadTasks();
      }
      else{
        //showPopup("Please log in to see your tasks");
      }
    });


    if (addTaskButton){
      addTaskButton.addEventListener("click", addTask);

    }else{
      console.error("add task button not found!");
    }



});


// saves note pad notes to db
document.addEventListener("DOMContentLoaded", () => {
  const addBox = document.querySelector(".add-box");
  const popUpBox = document.querySelector(".popup-box");
  const closeIcon = document.querySelector("header i");
  const addNoteBtn = document.querySelector(".add-note");
  const titleTag = document.getElementById("noteInput");
  const descTag = document.getElementById("noteDesc");
  const popupTitle = document.querySelector("header p");
  const addBtn = popUpBox.querySelector("button");
  
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  
  let isUpdate = false, updateId = null, currentUser = null;
  let notes = [];
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      loadNotesFromFirestore();
      document.querySelectorAll(".logged-in").forEach(el => el.style.display = "inline-block");
      document.querySelectorAll(".logged-out").forEach(el => el.style.display = "none");
    } else {
      currentUser = null;
      notes = [];
      showNotes();
      document.querySelectorAll(".logged-in").forEach(el => el.style.display = "none");
      document.querySelectorAll(".logged-out").forEach(el => el.style.display = "inline-block");
    }
  });
  
  addBox.addEventListener("click", () => {
    titleTag.focus();
    popUpBox.classList.add("show");
  });
  
  closeIcon.addEventListener("click", () => {
    popUpBox.classList.remove("show");
    resetForm();
  });
  
  addNoteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    const noteTitle = titleTag.value.trim();
    const noteDesc = descTag.value.trim();
  
    if (!noteTitle && !noteDesc) return;
  
    if (!currentUser) {
      showPopup("Please log in to save notes.");
      return;
    }
  
    const noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${months[new Date().getMonth()]} ${new Date().getDate()} ${new Date().getFullYear()}`
    };
  
    const notesRef = collection(db, "users", currentUser.uid, "notes");
  
    try {
      if (isUpdate && updateId) {
        await setDoc(doc(notesRef, updateId), noteInfo);
      } else {
        await addDoc(notesRef, noteInfo);
      }
  
      isUpdate = false;
      updateId = null;
      resetForm();
      closeIcon.click();
      loadNotesFromFirestore();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  });
  
  function resetForm() {
    titleTag.value = "";
    descTag.value = "";
    popupTitle.innerText = "Add a new note";
    addBtn.innerText = "Add Note";
  }
  
  function showNotes() {
    const notesContainer = document.querySelector(".wrapper");
    if (!notesContainer) return;
  
    // clear existing notes except the add-box
    const existingNotes = notesContainer.querySelectorAll(".note");
    existingNotes.forEach(note => note.remove());
  
    // sort notes by creation date (newest first)
    const sortedNotes = [...notes].sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  
    // add notes to DOM
    sortedNotes.forEach(note => {
      const noteElement = document.createElement("li");
      noteElement.className = "note";
      noteElement.dataset.id = note.id;
    
      noteElement.innerHTML = `
        <div class="details">
          <p>${note.title || 'Untitled Note'}</p>
          <span>${note.description || 'No description'}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date || formatFirestoreDate(note.createdAt)}</span>
          <div class="action-buttons">
            <!-- Buttons will be added here programmatically -->
          </div>
        </div>
      `;
  
      // create action buttons container
      const actionButtons = noteElement.querySelector(".action-buttons");
      
      // add edit button
      const editSpan = document.createElement("span");
      editSpan.innerHTML = "✎";
      editSpan.className = "edit-note";
      actionButtons.appendChild(editSpan);
  
      // add delete button
      const deleteSpan = document.createElement("span");
      deleteSpan.innerHTML = "×";
      deleteSpan.className = "delete-note";
      actionButtons.appendChild(deleteSpan);
  
      // add event listeners
      editSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        startEditNote(note.id);
      });
  
      deleteSpan.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          if (!currentUser) {
            showPopup("Please log in to delete notes.");
            return;
          }
          
          const confirmDelete = confirm("Are you sure you want to delete this note?");
          if (!confirmDelete) return;
  
          await deleteDoc(doc(db, "users", currentUser.uid, "notes", note.id));
          console.log("Note deleted successfully");
          await loadNotesFromFirestore();
        } catch (error) {
          console.error("Error deleting note:", error);
          alert("Failed to delete note. Please try again.");
        }
      });
  
      // existing menu event listeners
      const editBtn = noteElement.querySelector(".edit-btn");
      const deleteBtn = noteElement.querySelector(".delete-btn");
      const menuIcon = noteElement.querySelector(".menu-icon");
      
      if (editBtn) editBtn.addEventListener("click", () => startEditNote(note.id));
      if (deleteBtn) deleteBtn.addEventListener("click", () => deleteNote(note.id));
      if (menuIcon) menuIcon.addEventListener("click", showMenu);
      
      notesContainer.insertBefore(noteElement, addBox.nextSibling);
    });
  
  }


  async function loadNotesFromFirestore() {
    if (!currentUser) return;
  
    const notesRef = (collection(db, "users", currentUser.uid, "notes"));
   const querySnapshot = await getDocs(query(notesRef, orderBy("date", "asc")));
    notes = [];
    querySnapshot.forEach(docSnap => {
      notes.push({ ...docSnap.data(), id: docSnap.id });
    });
    showNotes();
  }
  
  
  
  window.updateNote = function (noteId, title, desc) {
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    popupTitle.innerText = "Update your note";
    addBtn.innerText = "Update Note";
  };
  function startEditNote(noteId) {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (!noteToEdit) return;
  
    isUpdate = true;
    updateId = noteId;
    if (titleTag) titleTag.value = noteToEdit.title || '';
    if (descTag) descTag.value = noteToEdit.description || '';
    if (popupTitle) popupTitle.textContent = "Update your note";
    if (addNoteBtn) addNoteBtn.textContent = "Update Note";
    popUpBox?.classList.add("show");
    titleTag?.focus();
  }
  window.showMenu = function (elem) {
    const menu = elem.nextElementSibling;
    menu.classList.toggle("show");
    document.addEventListener("click", function onClickOutside(e) {
      if (!menu.contains(e.target) && e.target !== elem) {
        menu.classList.remove("show");
        document.removeEventListener("click", onClickOutside);
      }
    });
  };
  
 
});

//settings script

// Background selection
const bgOptions = document.querySelectorAll('.bg-option');
let currentBg = 'default';

auth.onAuthStateChanged(async (user) => {
  console.log("Auth state changed, user:", user);
  if (user) {
    console.log("9 - User is logged in");
    await loadPreferences();
  } else {
    console.log("No user logged in");
    // Set default background if no user
    currentBg = 'default';
    updateBackground();
  }
});


bgOptions.forEach(option => {
	console.log("1");
  option.addEventListener('click', async() => {
    bgOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    currentBg = option.dataset.bg;
    await updateBackground();
    await savePreferences();
  });
});

async function updateBackground() {
  console.log("2");
  const user = auth.currentUser;
 /* if(!user){
	  console.log("3");
	  alert("You must be logged in to change the background");
	  return;
  }*/
  console.log("4");
  const bgVar = `--bg-image-${currentBg}`;
  document.documentElement.style.setProperty('--bg-image', `var(${bgVar})`);
}

// Save preferences to localStorage
async function savePreferences() {
  const user = auth.currentUser;
console.log("5");
  if(!user){
	  alert("you must be logged in to change the background!")
	  return;}
    console.log("user state", user);
  
  console.log("6");
  try{
  const bg = doc(db, "users", user.uid, "settings", "backgrounds");
  await setDoc(bg, {background: currentBg},
  
  {merge:true});
  console.log("8");
  } catch(error){
	  console.error("Saving: ", error);
  }

}

// Load saved preferences
async function loadPreferences() {
	console.log("9");
  const user = auth.currentUser;

  if (!user){
    console.log("9.5");
    return;
  }
  

	  const bg =  doc(db, "users", user.uid, "settings","backgrounds");
    console.log("9.75")

    try {
      const querySnapshot = await getDoc(bg);
	  console.log("10");
	  if (querySnapshot.exists()) {
      currentBg = querySnapshot.data().background || 'default';
	  console.log("11");
	   const activeOption = document.querySelector(`[data-bg="${currentBg}"]`);
      if (activeOption) {
		  console.log("12");
        activeOption.classList.add('active');
      }
      updateBackground();
	  console.log("13");
    }else{
      console.log("document doesn't exist");
    }
	  
    
    }catch(error){
      console.error("error: ", error);
    }
  

}

console.log("14")
// Initialize
//loadPreferences();