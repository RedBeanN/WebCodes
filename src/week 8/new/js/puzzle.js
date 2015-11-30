var _flag = false, steps = 0, timer, timeCtr = 0, btns;

$(function(){
    btns = $("#puzzle-container").find("button");
    backgoundChange("url(statics/default.jpg)");
    $("#step-bar")[0].value = steps;
    $("#replay").click(reset);
    $("#change").click(randomPic);
    $("#upload").click(uploadPic);
    $("#pic").error(resetPic);
    $("#time-bar")[0].value = 0;
    btns.click(move);
});

function move() {
    if (_flag) {
        var index = this.id;
        btns.each(function(i){if(this.id === index) index = i});
        steps += oneMove(index);
        $("#step-bar")[0].value = steps;
        check();
    }
}

function reset() {
    for(var i = 0; i < 100; ) { i += oneMove(_.random(15));}
    steps = 0, _flag = true, timeCtr = 0;
    $("#step-bar")[0].value = steps;
    $("#replay").html("重新开始");
    $("#time-bar")[0].value = timeCtr;
    setTimer();
}

function oneMove(index) {
    if (index - 4 >= 0 && btns[index - 4].id === "p16") { exchange(index - 4, index); }
    else if (index + 4 <= 15 && btns[index + 4].id === "p16") { exchange(index, index + 4); }
    else if (index - 1 >= 0 && index % 4 != 0 && btns[index - 1].id === "p16") { exchange(index - 1, index); }
    else if (index + 1 <= 15 && index % 4 != 3 && btns[index + 1].id === "p16") { exchange(index + 1, index); }
    else return false;
    return true;
}
function exchange(first, second) {
    $(btns[first]).insertBefore(btns[second]);
    btns = $("#puzzle-container").find("button");
    $(btns[second]).insertBefore(btns[first]);
    btns = $("#puzzle-container").find("button");
}

function check() {
    var ctr = 0;
    btns.each(function(i) {ctr += (this.id === "p" + (i + 1))});
    if (ctr === 16) {
        alert("还原成功！你在" + timeCtr + "秒内用" + steps + "步完成了拼图！");
        clearInterval(timer);
        _flag = false;
        steps = 0;
        clearInterval(timer);
    }
}

function randomPic() {
    var n, pics = ["default", "pic1", "pic2"], tm = $("#p1")[0].style.backgroundImage;;
    while(true) { if (tm.indexOf(pics[n = _.random(0, 2)], 0) === -1) break; }
    backgoundChange("url(statics/" + pics[n] + ".jpg)");
}
function uploadPic() {
    if ($("#web-route")[0].value === "") { alert("请输入指定图片的路径！"); }
    else { backgoundChange("url(" + $("#web-route")[0].value + ")"); }
}
function resetPic() {
    alert("无法找到指定的图片，将重置为默认图片。");
    backgoundChange("url(statics/default.jpg)");
}

function backgoundChange(route) {
    var srr = route.substring(4, route.length - 1);
    $("#pic")[0].src = srr;
    btns.each(function() { if (this.id != "p16") this.style.backgroundImage = route; });
}

function setTimer() {
    clearInterval(timer);
    timer = window.setInterval(onTime, 1000);
}
function onTime() {
    timeCtr++;
    $("#time-bar")[0].value = timeCtr;
}