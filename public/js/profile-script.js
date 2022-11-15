document
	.getElementById("followingBtn")
	.addEventListener("click", redirectFollowing);

function redirectFollowing() {
	let location = window.location.href;
	location = location += "/following";
	console.log(location);
	window.location = location;
}
