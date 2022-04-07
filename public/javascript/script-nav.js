// navbar script
// $(document).ready(function () {
//     $('#icon').click(function () {
//         $('ul').toggleClass('show');
//     });
// });

const menu = document.querySelector('#menu-btn');
const navbar = document.querySelector('.header .navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}


