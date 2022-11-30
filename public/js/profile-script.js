document
	.getElementById("followingBtn")
	.addEventListener("click", redirectFollowing);

function redirectFollowing() {
	let location = window.location.href;
	location = location += "/following";
	console.log(location);
	window.location = location;
}

document.getElementById("reviewBtn").addEventListener("click", redirectReviews);

function redirectReviews() {
	let location = window.location.href;
	location = location += "/reviews";
	console.log(location);
	window.location = location;
}

function uploadImage() {
	// alert("hi!");
	let imgLink = document.getElementById("imgLink").value;
	if (imgLink == "" || !imgLink.match(/\.(jpeg|jpg|gif|png)$/)) {
		alert("Please enter a valid image link");
		return;
	}
	let imgName = document.getElementById("imgName").value;
	if (imgName == "") {
		alert("Please enter a valid image name");
		return;
	}
	let imgYear = document.getElementById("imgYear").value;
	if (imgYear == "") {
		alert("Please enter a valid image year");
		return;
	}
	let imgCategory = document.getElementById("imgCategory").value;
	if (imgCategory == "") {
		alert("Please enter a valid image category");
		return;
	}
	let imgMedium = document.getElementById("imgMedium").value;
	if (imgMedium == "") {
		alert("Please enter a valid image medium");
		return;
	}

	imgDescription = document.getElementById("imgDescription").value;
	if (imgDescription == "") {
		alert("Please enter a valid image description");
		return;
	}

	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 201) {
			alert("Image uploaded successfully!");
			window.location.reload();
		} else if (this.readyState == 4 && this.status == 403) {
			alert("Image upload failed");
		} else {
			console.log(this.status);
		}
	};
	http.open("POST", "/gallery/upload", true);
	http.setRequestHeader("Content-type", "application/json");
	http.send(
		JSON.stringify({
			imgLink: imgLink,
			imgName: imgName,
			imgYear: imgYear,
			imgCategory: imgCategory,
			imgMedium: imgMedium,
			imgDescription: imgDescription,
		})
	);
}
