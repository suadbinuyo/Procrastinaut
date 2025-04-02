import { initializeApp } from  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, deleteDoc, query, where, serverTimestamp } from  "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

 

 const firebaseConfig = {
  apiKey: "AIzaSyBdDUUJKgBgSyV6bL9Qrw93BWzjEODZjtI",
  authDomain: "first-project-dc60b.firebaseapp.com",
  projectId: "first-project-dc60b",
  storageBucket: "first-project-dc60b.firebasestorage.app",
  messagingSenderId: "692391873078",
  appId: "1:692391873078:web:12ec161a69cbee938a2697",
  measurementId: "G-8WM43P61Z6"
};
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 //make auth and firestore references
 const auth = getAuth(app);
 const db = getFirestore(app);

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
    console.log("user logged in: ", user);

    logoutButton.style.display = "block";
    loginButton.style.display ="none";
    signup.style.display = "none";
    
  }
  else{
    console.log("user logged out");
     logoutButton.style.display = "none";
     loginButton.style.display ="block";
     signup.style.display = "block";
     
  }
 

 });
  
  
   document.addEventListener("DOMContentLoaded", () =>{

    const signupForm = document.querySelector('#signup-form');
    const loginForm = document.querySelector("#login-form");
  


    //sign up users

signupForm.addEventListener("submit", (e) =>{
  e.preventDefault(); // prevents info from being lost after clicking sign up (refreshing)

  // getting user info
  const email = signupForm["signup-email"].value
  const password = signupForm["signup-password"].value

  // sign up the user
  
  createUserWithEmailAndPassword(auth, email, password).then(async cred =>{
	  console.log("aaaa");
    const user = cred.user;  
  
    await setDoc(doc(db, "users", user.uid),{
          uid: user.uid,
          email: email,
          createdAt: new Date()
      });
    

      console.log("user signed up and saved in firestore");
    
    
      const modal = document.querySelector("#signup-modal");
      modal.classList.remove("show"); // closing modal
      

      signupForm.reset(); // resetting form
  })

});

 // logout

 logout.addEventListener("click", (e) =>{
   e.preventDefault();
   
   signOut(auth).then(()=>{
     console.log("User signed out");
   });
  
 });


 // logging in
 loginForm.addEventListener("submit", (e)=>{
	 console.log("wwwweee");
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
          alert("You must be logged in to add tasks!");
          return;
        }


        if(taskInput.value.trim()=== ""){
          alert("Please add a task !");
          return;
        }

        try{

          await addDoc(collection(db, "users", user.uid, "tasks"),{
            task: taskInput.value.trim(),
            completed: false,
            createdAt: new Date()
          });


          console.log("task added successfully");
          taskInput.value = ""; // clear input after adding task
          loadTasks(); // loads taks 
        } catch (error){
          console.error("error adding task:", error);
        }
      
    }

    // loads tasks from firestore
    async function loadTasks() {
      const user = auth.currentUser;
      if(!user){
        listContainer.innerHTML = "<p>Please log in to see your tasks.</p><button class='modal-btn'>Log in</button>";
        return;
      }

      listContainer.innerHTML= ""; // clear before fetching

      try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "tasks"));
        querySnapshot.forEach((doc) => {
          createTaskElement(doc.id, doc.data().task);
        });
      } catch (error){
        console.error("Error fetching tasks: ", error);
      }
      
    }

    // function tthat creates tasks elements

    function createTaskElement(taskId, taskTest){
      let li = document.createElement("li");
      li.textContent = taskTest;


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
          console.log("Task deleted successfully");
          loadTasks();



        } catch (error){
          console.error("error deleting task: ", error);
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
        listContainer.innerHTML = "<p>Please log in to see your tasks.</p><button class='modal-btn'>Log in</button>";
      }
    });


    if (addTaskButton){
      addTaskButton.addEventListener("click", addTask);

    }else{
      console.error("add task button not found!");
    }



});

document.addEventListener("DOMContentLoaded"), ()=>{
  const addBox = document.querySelector(".add-box");
  const popUpBox = document.querySelector(".popup-box");
  const closeIcon = document.querySelector("header i");
  const addNoteBtn = document.querySelector(".add-note");
  const titleTag = document.getElementById("noteInput");
  const descTag = document.getElementById("noteDesc");
  const popupTitle = document.querySelector("header p");
  const addBtn = document.querySelector("button");

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let isUpdate = false;
  let updateId = null;
  let currentUser = null;
  let notes = [];


  onAuthStateChanged(auth, (user) =>{
    if (user){ // displays content if user is logged in
      currentUser = user;
      loadNotes();
      document.querySelectorAll(".logged-in").forEach(elm => elm.style.display = "inline-block");
      document.querySelectorAll(".logged-out").forEach(elm => elm.style.display = "none");
    }
    else {
      currentUser = null;
      notes = [];
      showNotes();
      document.querySelectorAll(".logged-in").forEach(elm => elm.style.display = "none");
      document.querySelectorAll(".logged-out").forEach(elm => elm.style.display = "inline-block");
    }
  });

  addBox.addEventListener("click", () =>{
    titleTag.focus();
    popUpBox.classList.add("show");
  });

  closeIcon.addEventListenerr("click", () =>{
    titleTag.focus();
    popUpBox.classList.remove("show"); // disappers if user closes form
    resetForm(); // clears form 
  });

  addNoteBtn.addEventListener("click", async (e) =>{
    e.preventDefault();

    const noteTitle = titleTag.value.trim();
    const noteDesc = descTag.value.trim();

    if (!noteTitle && !noteDesc) return;

    if (!currentUser){
      alert("Please log in to save notes");
      return;
    }

    const noteInfo = {
      title: titleTag,
      description: noteDesc,
      date: `${months[new Date().getMonth()]} ${new Date().getDate()} ${new Date().getFullYear()}`
    };


    const notesRef = collection(db, "users", currentUser.uid, "notes");
    // adding to firestore
    try {
      if (isUpdate && updateId){
        await setDoc(doc(notesRef, updateId), noteInfo);
      }else{;
        await addDoc(notesRef, noteInfo)
      }

      isUpdate = false;
      updateId = null;
      resetForm();
      closeIcon.click();
      loadNotes();

    }catch (err){
      console.error("error saving note: ", err);
    }
  });

  function resetForm(){
    titleTag.value = "";
    descTag.value = "";
    popupTitle.innerText = "Add a new note";
    addBtn.innerText = "Add note";
  }

  function showNotes(){
    const notesContainer = document.querySelector(".wrapper");
    if (!notesContainer) return;


    // clear existing notes except add box
    const existingNotes = notesContainer.querySelectorAll(".note");
    existingNotes.forEach(note => note.remove());

    // sort notes by newest first
    const sortedNotes = [...notes].sort((a, b) =>{
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;

    });
    
  }
}

//settings script

// Background selection
const bgOptions = document.querySelectorAll('.bg-option');
let currentBg = 'default';


bgOptions.forEach(option => {
	console.log("1");
  option.addEventListener('click', async() => {
    bgOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
	console.log("2");
    currentBg = option.dataset.bg;
    await updateBackground();
    await savePreferences();
  });
});

async function updateBackground() {
  console.log("3");
  const user = auth.currentUser;
  if(!user){
	  console.log("3.5");
	  alert("You must be logged in to change the background");
	  return;
  }
  console.log("4");
  const bgVar = `--bg-image-${currentBg}`;
  document.documentElement.style.setProperty('--bg-image', `var(${bgVar})`);
}

// Save preferences to localStorage
async function savePreferences() {
	console.log("5");
  if(!user)
	  console.log("5");
	  return;
  try{
  console.log("6");
  const bg = doc(db, "users", user.uid, "backgrounds");
  await setDoc(bg, {background: currentBg},
  console.log("7");
  {merge:true});
  console.log("8");
  } catch(error){
	  console.error("Saving: " error);
  }
// Load saved preferences
async function loadPreferences() {
	console.log("9");
  const user = auth.currentUser;
  console.log(user);
  try{
	  
	  const bg =  doc(db, "users", user.uid, "background"));
	  const querySnapshot = await getDoc(bg);
	  console.log("10");
	  if (querySnapshot.exists()) {
      currentBg = docSnap.data().background || 'default';
	  console.log("11");
	   const activeOption = document.querySelector(`[data-bg="${currentBg}"]`);
      if (activeOption) {
		  console.log("12");
        activeOption.classList.add('active');
      }
	  console.log("13");
      updateBackground();
    }
} catch(error) => {
	console.error("loading error: ", error);
}}
// Initialize
console.log("14");
loadPreferences();