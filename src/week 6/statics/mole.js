var tCtr, sCtr, timer, gameFlag;

window.onload = function() {
    document.getElementById("timer-text").value = 30;
    document.getElementById("score-text").value = 0;
    document.getElementById("status-text").value = "Ready";
    gameFlag = 0;
    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("stop-button").addEventListener("click", stopGame);
}

function startGame() {
    if (gameFlag === 0) {
        document.getElementById("status-text").value = "Playing";
        gameFlag = 1;
        tCtr = 30, sCtr = 0;
        document.getElementById("timer-text").value = tCtr;
        document.getElementById("score-text").value = sCtr;
        timer = window.setInterval(onTime, 1000);
        setMole();
    }
}

function gameOver() {
    alert("Game Over.\nYour score is: " + sCtr);
    resetMole();
}

function stopGame() {
    clearInterval(timer);
    resetMole();
    document.getElementById("timer-text").value = 30;
    document.getElementById("score-text").value = 0;
    document.getElementById("status-text").value = "Stopped";
    gameFlag = 0;
}

function onTime() {
    tCtr--;
    document.getElementById("timer-text").value = tCtr;
    if (tCtr === 0){
        clearInterval(timer);
        document.getElementById("status-text").value = "Game Over";
        gameFlag = 0;
        gameOver();
    }
}

function setMole() {
    if (document.getElementsByClassName("target").length != 0) {
        document.getElementsByClassName("target")[0].removeEventListener("click", rightClick);
        document.getElementsByClassName("target")[0].className = "mole";
    }
    var moles = document.getElementsByClassName("mole");
    for(var i = 0; i < moles.length; i++) {
        moles[i].addEventListener("click", wrongClick);
    }
    var position = parseInt(Math.random() * 60, 10);
    moles[position].removeEventListener("click", wrongClick);
    moles[position].addEventListener("click", rightClick);
    moles[position].className = "target";
}

function resetMole() {
    if (document.getElementsByClassName("target").length != 0) {
        document.getElementsByClassName("target")[0].className = "mole";
    }
    var moles = document.getElementsByClassName("mole");
    for(var i = 0; i < moles.length; i++) {
        moles[i].removeEventListener("click", rightClick);
        moles[i].removeEventListener("click", wrongClick);
    }
}

function rightClick() {
    sCtr++;
    setMole();
    document.getElementById("score-text").value = sCtr;
}
function wrongClick() {
    sCtr--;
    if(sCtr < 0) sCtr = 0;
    document.getElementById("score-text").value = sCtr;
}