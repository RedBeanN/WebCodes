var game = 0;
var inRoute = 0;
window.onload = function() {
    document.getElementById("start").addEventListener("mouseenter", startGame);
    document.getElementById("end").addEventListener("mouseenter", endGame);
    document.getElementById("route").addEventListener("mouseenter", cheatCheck);
    var blocks = document.getElementsByClassName("block");
    for(var i = 0; i < blocks.length; i++) {
        blocks[i].addEventListener("mouseenter", wall);
    }
}
function startGame() {
    var blocks = document.getElementsByClassName("block");
    game = 1;
    document.getElementById("win").style.opacity = "0";
    document.getElementById("lose").style.opacity = "0";
    document.getElementById("cheat").style.opacity = "0";
    for(var i = 0; i < blocks.length; i++) {
        blocks[i].style.backgroundColor = "#eeeeee";
    }
}

function endGame() {
    if (game === 2) {
        document.getElementById("win").style.opacity = "1";
        game = 0;
    } else if (game === 1) {
        document.getElementById("cheat").style.opacity = "1";
        game = 0;
    }
}

function cheatCheck() {
    if (game != 0) game = 2;
}

function wall() {
    if (game != 0) {
        this.style.backgroundColor = "#ff0000";
        document.getElementById("lose").style.opacity = "1";
        game = 0;
    }
}