window.onload = function () {
	const http = new XMLHttpRequest();
	let locationString = location.href + "/delete";
	http.open("DELETE", locationString, true);
	http.send();
};
