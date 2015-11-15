var tCtr, sCtr, timer, gameFlag;
/*
    这里使用全局变量是因为这些变量需要
    在大部分的函数中共用；gameFlag是用
    来判断游戏是否正在进行中的，可以避
    免多次点击Start的bug，也可以避免游
    戏结束后还能继续改变分数。
                                        */

window.onload = function() {
    document.getElementById("timer-text").value = 30;
    document.getElementById("score-text").value = 0;
    document.getElementById("status-text").value = "Ready";
    gameFlag = 0;
    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("stop-button").addEventListener("click", stopGame);
/*
    初始化所有变量，同时开始监听两个按
    钮的点击事件。
                                        */
}

function startGame() {
/*
    判断是否已经开始游戏，如果已经开始
    了，那么点击Start Game是没有任何作
    用的；如果还没开始，重置计时器和计
    分器。
                                        */
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

function gameOver() {
    alert("Game Over.\nYour score is: " + sCtr);
    resetMole();
}

function setMole() {
/*
    这里包含了游戏的大部分逻辑：先清除
    已经存在的target监听的点击事件，然
    后为所有mole添加wrong click的点击事
    件，最后随机选择一个点，把wrong click
    事件改成right click事件。
                                        */
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
/*
    在Stop Game或Game Over触发时，移除
    所有的事件监听，然后把所有的点都重
    置，这样点击任何一个点都不会导致分
    数的改变。
                                        */
    if (document.getElementsByClassName("target").length != 0) {
        document.getElementsByClassName("target")[0].className = "mole";
    }
    var moles = document.getElementsByClassName("mole");
    for(var i = 0; i < moles.length; i++) {
        moles[i].removeEventListener("click", rightClick);
        moles[i].removeEventListener("click", wrongClick);
    }
}

/*
    如果点击是正确的，加分并重新生成一
    个target；如果点击是错误的，扣除分
    数，如果分数到负了始终视为0。
                                        */
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