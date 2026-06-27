const form = document.getElementById("loginForm");

form.addEventListener("submit", function(event){

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if(email === ""){

        alert("Please enter your email.");

        return;

    }

    if(password === ""){

        alert("Please enter your password.");

        return;

    }

    alert("Login Successful!");

    window.location.href = "index.html";

});