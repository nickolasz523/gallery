function login() {
	console.log("hi");
	errors = document.getElementById("loginError");
	errors.innerHTML = "";
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	if (username == "" || password == "") {
		document.getElementById("loginError").innerHTML =
			"Please enter a username and password";
		errors.classList.remove("hide");
		return;
	} else {
		errors.classList.add("hide");
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 201) {
			errors.classList.add("hide");
			errors.innerHTML = "";
			window.location.href = "/users/" + username;
		} else if (this.readyState == 4 && this.status == 403) {
			errors.innerHTML = "Invalid username or password";
			errors.classList.remove("hide");
		}
	};
	xhttp.open("POST", "/login", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify({ username: username, password: password }));
}
