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

	const http = new XMLHttpRequest();
	const url = `/gallery/${id}/comment`;
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 201) {
			document.getElementById(`${id}-num-comments`).innerHTML =
				parseInt(
					document.getElementById(`${id}-num-comments`).innerHTML
				) + 1;
		}
	};

	http.open("POST", url);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(JSON.stringify({ user: user, comment: userCommentText }));
}
