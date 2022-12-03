function createWorkshop() {
	let workshopName = document.getElementById("workshopName").value;

	if (workshopName === "") {
		alert("Please enter a workshop name.");
		return;
	}

	let locationString = location.href;

	console.log(workshopName);

	locationString = locationString.split("/");
	locationString = locationString[locationString.length - 2];

	console.log(locationString);

	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 201) {
			alert("Workshop created");
			location.reload();
		} else if (this.readyState == 4 && this.status == 400) {
			alert(this.responseText);
		}
	};
	http.open("POST", "/users/" + locationString + "/workshop", true);
	http.setRequestHeader("Content-type", "application/json");
	http.send(JSON.stringify({ workshopName: workshopName }));
}
