//list of countries in the world
document.addEventListener('DOMContentLoaded', () => {
    const selectDropCountry = document.querySelector('#country');

    fetch('https://restcountries.com/v2/all').then(res => {
        return res.json();
    }).then(data => {
        let output = "";
        data.forEach(country => {

            output += `
      <option value="${country.name}">${country.name}</option>`;
        })
        selectDropCountry.innerHTML = output;
    }).catch(err => {
        console.log(err);
    })
});

//script to send data into database when registering
// $("#updateInfo-button").click(function () {
//
//     // get the values
//     // var userId = $('#userId').val();
//     var fname = $('#firstname').val();
//     var lname = $('#lastname').val();
//     var uname = $('#username').val();
//     var email = $('#email').val();
//     var phone = $('#phone').val();
//     var gender = $('#gender').val();
//     var country = $('#country').val();
//     var city = $('#city').val();
//
//     // if (fname == '' && pass == '') {
//     //     alert("too short");
//     // } else {
//
//     //send data
//     $.post("/editDetails", {
//         // userId: userId,
//         firstname: fname,
//         lastname: lname,
//         username: uname,
//         email: email,
//         phone: phone,
//         gender: gender,
//         country: country,
//         city: city
//     })
//         .done(function (data) {
//             // window.location = "/userInfo?userId=<%= userId %>";
//             alert(data);
//         });
// });