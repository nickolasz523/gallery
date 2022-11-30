function search() {
	let search = document.querySelector(".search-input").value;
	let type = document.querySelector(".search-select").value;

	window.location = `/gallery?search=${search}&type=${type}`;
}
