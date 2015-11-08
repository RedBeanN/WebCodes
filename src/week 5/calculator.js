window.onload = function() {
    document.getElementById("data_bar").value=0;
    var str="";
    document.getElementById("equal").onclick = function() {
        try {
            if (eval(str) != Infinity) {
                if (eval(str) === undefined) str="0";
                document.getElementById("data_bar").value=eval(eval(str).toFixed(14));
                str="";
            } else {
                throw exception;
            }
        }
        catch(exception) {
            alert("输入的表达式不合法，请重新输入。");
            str="";
            document.getElementById("input_bar").value=0;
        }
    }
    document.getElementById("CE").onclick = function() {
        str = "";
        document.getElementById("data_bar").value=0;
        document.getElementById("input_bar").value="";
    }
    document.getElementById("one").onclick = function() {
        str = str + "1";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("two").onclick = function() {
        str += "2";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("three").onclick = function() {
        str += "3";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("four").onclick = function() {
        str += "4";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("five").onclick = function() {
        str += "5";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("six").onclick = function() {
        str += "6";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("seven").onclick = function() {
        str += "7";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("eight").onclick = function() {
        str += "8";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("nine").onclick = function() {
        str += "9";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("zero").onclick = function() {
        str += "0";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("plus").onclick = function() {
        str += "+";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("minus").onclick = function() {
        str += "-";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("multiply").onclick = function() {
        str += "*";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("divide").onclick = function() {
        str += "/";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("dot").onclick = function() {
        str += ".";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("lt").onclick = function() {
        str += "(";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("rt").onclick = function() {
        str += ")";
        document.getElementById("input_bar").value=str;
    }
    document.getElementById("backspace").onclick = function() {
        str = str.substring(0, str.length - 1);
        document.getElementById("input_bar").value=str;
    }
}