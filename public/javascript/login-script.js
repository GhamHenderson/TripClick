$("#login-button").click(function () {

    // Get the values
    var user = $('#username').val();
    var pass = $('#password').val();
    var firstn = $('#firstname').val();


    if (user == '' || pass == '') {
        alert("too short");
    } else {

        // Send the data
        $.post("/login", {
            username: user,
            password: pass,
            firstname: firstn
        })
            .done(function (data) {

                alert(data);
            });
    }

});
