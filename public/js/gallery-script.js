function clickImage(id) {
	let location = `/gallery/${id}`;
	window.location = location;
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
		if (this.readyState == 4 && this.status == 200) {
			let commentid = this.responseText;
			commentid = commentid.substring(1, commentid.length - 1);
			let bruh = "bruh";
			let commentDiv = document.getElementById(`${id}-comment-list`);

			let onecomment = document.createElement("div");
			onecomment.classList.add("onecomment-container");

			onecomment.id = `comment${commentid}-art${id}-comment`;
			let comment = document.createElement("div");

			let icon = document.createElement("i");
			icon.classList.add("fas");
			icon.classList.add("fa-trash-alt");
			icon.onclick = function () {
				console.log(commentid);
				console.log(bruh);
				deleteComment(id, commentid, user);
			};
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

			onecomment.appendChild(comment);
			onecomment.appendChild(icon);
			commentDiv.appendChild(onecomment);

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
		if (this.readyState == 4 && this.status == 200) {
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

//add remove button to all comments
function deleteComment(picture, comment, user) {
	const http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log("comment deleted");
			let commentDiv = document.getElementById(`${picture}-comment-list`);
			let commentElement = document.getElementById(
				`comment${comment}-art${picture}-comment`
			);
			// console.log(commentElement);
			commentDiv.removeChild(commentElement);

			document.getElementById(`${picture}-num-comments`).innerHTML =
				parseInt(
					document.getElementById(`${picture}-num-comments`).innerHTML
				) - 1;
		}
	};
	http.open("DELETE", `/gallery/${picture}/delete`);
	http.setRequestHeader("Content-Type", "application/json");
	http.send(
		JSON.stringify({ artid: picture, commentid: comment, user: user })
	);
}
