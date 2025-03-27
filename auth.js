 // Import the functions you need from the SDKs you need
 
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 //make auth and firestore references
 const auth = getAuth(app);
 const db = getFirestore(app);

 


 onAuthStateChanged(auth, (user) =>{
  const logoutButton = document.getElementById("logout");
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





//    //storing info from todolist to database

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
