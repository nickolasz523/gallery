function clickImage(id) {
	console.log(id);
}

function checkLength(input) {
	if (input.value.length > 0) {
		input.nextElementSibling.disabled = false;
	} else {
		input.nextElementSibling.disabled = true;
	}
}

//get element by class name
document.querySelectorAll(".comment-input").forEach((input) => {
	input.addEventListener("keyup", () => {
		checkLength(input);
	});
});

function postComment(id, user) {
	let userCommentText = document.getElementById(`${id}-comment`).value;
	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 201) {
			let commentDiv = document.getElementById(`${id}-comment-list`);
			let comment = document.createElement("div");

			let commentUser = document.createElement("a");
			commentUser.innerHTML = user;
			commentUser.classList.add("comment-user");
			commentUser.href = `/users/${user}`;

			let commentText = document.createElement("p");
			commentText.classList.add("comment-text");
			commentText.innerHTML = userCommentText;

			comment.classList.add("comment");
			comment.id = `${user}-${id}-comment`;

			comment.appendChild(commentUser);
			comment.appendChild(commentText);

			commentDiv.appendChild(comment);
			document.getElementById(`${id}-num-comments`).innerHTML =
				parseInt(
					document.getElementById(`${id}-num-comments`).innerHTML
				) + 1;
		}
	};

	http.open("PUT", `/gallery/${id}/comment`);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(JSON.stringify({ user: user, comment: userCommentText }));
}

function like(id, user) {
	let heart = document.getElementById(`${id}-heart`);
	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 201) {
			if (heart.classList.contains("far")) {
				heart.classList.add("fas");
				heart.classList.remove("far");
				document.getElementById(`${id}-num-likes`).innerHTML =
					parseInt(
						document.getElementById(`${id}-num-likes`).innerHTML
					) + 1;
			} else {
				heart.classList.add("far");
				heart.classList.remove("fas");
				document.getElementById(`${id}-num-likes`).innerHTML =
					parseInt(
						document.getElementById(`${id}-num-likes`).innerHTML
					) - 1;
			}
		}
	};
	http.open("PUT", `/gallery/${id}/like`);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(JSON.stringify({ user: user }));
}
