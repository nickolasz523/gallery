function follow(username){
    //XML put request to follow user
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            alert("Followed user");
            location.reload();
        }
        if (this.readyState == 4 && this.status == 400) {
            alert("You are already following this user");
            location.reload();

        }

    };
    http.open("PUT", "/users/" + username + "/follow", true);
    http.send();
}

function unfollow(username){
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            alert("Unfollowed user");
            location.reload();

        }
        if (this.readyState == 4 && this.status == 400) {
            alert("You are not following this user");
            location.reload();
        }
    }
    http.open("PUT", "/users/" + username + "/unfollow", true);
    http.send();
}