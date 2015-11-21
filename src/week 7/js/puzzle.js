var arr=[];
var flag = 0, steps = 0;
window.onload = function() {
    arr = findButton();
    document.getElementById("step-bar").value = 0;
    document.getElementById("replay").onclick = reset;
    document.getElementById("change").onclick = randomPic;
    document.getElementById("upload").onclick = uploadPic;
    document.getElementById("pic").onerror = resetPic;
    backgoundChange("url(statics/default.jpg)");
    var a = document.getElementById("puzzle-container");
    for (var i = 0; i < 16; i++) {
        a.children[i].addEventListener("click", move);
    }
}

function findButton() {
    return document.getElementById("puzzle-container");
}

function reset() {
    var index;
    for (var i = 0; i < 100; ) {
        index = parseInt(Math.random() * 16, 10);
        if (index - 4 >= 0 && arr.children[index - 4].id === "p16") {
            exchange(index-4, index);
            i++;
        }
        if (index + 4 <= 15 && arr.children[index + 4].id === "p16") {
            exchange(index, index+4);
            i++;
        }
        if (index - 1 >= 0 && index % 4 != 0 && arr.children[index - 1].id === "p16") {
            exchange(index -1, index);
            i++;
        }
        if (index + 1 <= 15 && index % 4 != 3 && arr.children[index + 1].id === "p16") {
            exchange(index +1, index);
            i++;
        }
    }
    flag = 1;
    steps = 0;
    document.getElementById("step-bar").value = steps;
    document.getElementById("replay").innerText = "重新开始";
}

function move() {
    if (flag === 1) {
        for (var i = 0; i < 16; i++) {
            if (arr.children[i].id === this.id) {
                index = i;
                break;
            }
        }
        if (index - 4 >= 0 && arr.children[index - 4].id === "p16") { exchange(index - 4, index); }
        if (index + 4 <= 15 && arr.children[index + 4].id === "p16") { exchange(index, index + 4); }
        if (index - 1 >= 0 && index % 4 != 0 && arr.children[index - 1].id === "p16") { exchange(index - 1, index); }
        if (index + 1 <= 15 && index % 4 != 3 && arr.children[index + 1].id === "p16") { exchange(index + 1, index); }
        
        var ctr = 0;
        check();
    }
}

function exchange(first, second) {
    arr.insertBefore(arr.children[first], arr.children[second]);
    arr.insertBefore(arr.children[second], arr.children[first]);
    steps++;
    document.getElementById("step-bar").value = steps;
}

function check() {
    var ctr = 0;
    for(var i = 0; i < 16; i++) {
        if(arr.children[i].id === ("p" + (i + 1))) {
            ctr++;
        }
    }
    if (ctr === 16) {
        alert("还原成功！你用了" + steps + "步完成拼图！");
        flag = 0;
    }
}

function randomPic() {
    var pics = ["default", "pic1", "pic2"];
    var n = parseInt(Math.random() * 3, 10);
    var i = 1;
    while(true) {
        var tm = document.getElementById("p1").style.backgroundImage;
        if (tm.indexOf(pics[n], 0) != -1) {
            n = parseInt(Math.random() * 3, 10);
            i++;
        } else break;
    }
    backgoundChange("url(statics/" + pics[n] + ".jpg)");
}

function uploadPic() {
    console.log("1");
    if (document.getElementById("web-route").value === "") {
    console.log("1");
        alert("请输入指定图片的路径！");
    } else {
        backgoundChange("url(" + document.getElementById("web-route").value + ")");
    }
}

function resetPic() {
    alert("无法找到指定的图片，将重置为默认图片。");
    backgoundChange("url(statics/default.jpg)");
}

function backgoundChange(route) {
    var foo = document.getElementById("puzzle-container");
    var srr = route.substring(4, route.length - 1);
    document.getElementById("pic").src = srr;
    for (var i = 0; i < 16; i++) {
        if (foo.children[i].id != "p16") {
            foo.children[i].style.backgroundImage = route;
        }
    }
}