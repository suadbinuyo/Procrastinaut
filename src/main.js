
document.addEventListener("DOMContentLoaded", function (){
    const	modals = {
      signup: document.getElementById("signup-modal"),
      login: document.getElementById("login-modal")
    };

    const openModalBtns = document.querySelectorAll(".open-modal");

    const closeModalBtns = document.querySelectorAll(".close-modal");

    openModalBtns.forEach(button => {
      button.addEventListener("click", function (event){
        event.preventDefault();

        const targetModal = button.getAttribute("data-modal");
        if(modals[targetModal]){
          modals[targetModal].classList.add("show");

        }
      });
    });

    closeModalBtns.forEach(button =>{
      button.addEventListener("click", function (){
        const modal = button.closest(".modal");
        if(modal){
          modal.classList.remove("show");
        }

      });
    });

    window.addEventListener("click", function(event){
      Object.values(modals).forEach(modal =>{
        if(event.target === modal){
          modal.classList.remove("show");
        }
      });
    });
      
  });


