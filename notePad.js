const addBox = document.querySelector(".add-box");
const popUpBox = document.querySelector(".popup-box");
const closeIcon = document.querySelector("header i");
const addNoteBtn = document.querySelector(".add-note");
const titleTag= document.querySelector("input");
const descTag= document.querySelector("textarea");
const addBtn = popUpBox.querySelector("button");
const popupTitle = document.querySelector("header p");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let isUpdate = false;


/*displays popup*/
addBox.addEventListener("click", ()=>{
	console.log("Popup triggered");
   titleTag.focus();
    popUpBox.classList.add("show");
});

/*closes popup*/
closeIcon.addEventListener("click", ()=>{
    popUpBox.classList.remove("show")
});


/*adds note to list once user is finshed typing and presses add note, includes time*/
addNoteBtn.addEventListener("click", (e) => {
	console.log("add note clicked");
    e.preventDefault();
     let noteTitle = titleTag.value,
     noteDesc = descTag.value;
      if (noteTitle || noteDesc){


        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();
		console.log("working");

        let noteInfo = {
            title: noteTitle, description: noteDesc,
            date: `${month} ${day} ${year}`
        }  
		console.log("stiiiiiiiiiil working");
     if(!isUpdate){
             notes.push(noteInfo);
			 console.log("blah");
        }else {
            isUpdate = false;
            notes[UpdateId] = noteInfo
			console.log("beeeeeep");
        } 
        localStorage.setItem("notes", JSON.stringify(notes));
		console.log("AAAAAAAAAAAAAAAAAAA");
        closeIcon.click()
        showNotes()
		
     }
});




const notes = JSON.parse(localStorage.getItem("notes") || "[]");

/*displays all notes in the list*/
function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove())
  notes.forEach((note, index) => {
    let liTag = `  <li class="note">
      <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
      </div>
      <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="menu">
                <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
            </ul>
        </div>
      </div>
     </li>`;
     addBox.insertAdjacentHTML("afterend", liTag)
  });
};
showNotes(); 

closeIcon.addEventListener("click", ()=>{
    titleTag.value = "";
    descTag.value = "";
});


/*edit or delete note from list*/
function showMenu(elem){
   elem.parentElement.classList.add("show")
    document.addEventListener("click", e =>{
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show")
        }
    });
}


function deleteNote(noteId) {
	/*asks for confirmation, then removes if yes*/
    let confirmDel = confirm("Are you sure you want to delete this item?");
    if (!confirmDel) return;

    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc) {
    isUpdate = true;
    UpdateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
}


const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbarMenu')


menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});
