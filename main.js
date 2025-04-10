

//  script for drop down menu when page resizes
  const menu = document.querySelector('#mobile-menu')
  const menuLinks = document.querySelector('.navbarMenu')
  
  

  document.addEventListener("DOMContentLoaded", function (){
    menu.addEventListener('click', function(){
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });

  });