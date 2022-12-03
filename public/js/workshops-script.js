function enrollWorkshop(id, username) {
	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 204) {
			alert("Done!");
			location.reload();
		}
	};

	http.open("PUT", "/workshops/" + id + "/enroll", true);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(JSON.stringify({ user: username }));
}

function unenrollWorkshop(id, username) {
	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 204) {
			alert("Unenrolled!");
			location.reload();
		}
	};

	http.open("PUT", "/workshops/" + id + "/unenroll", true);
	http.send(JSON.stringify({ user: username }));
}
