var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var querystring = require("querystring");

http.createServer(function (request, response) {
	var username = parseName(request.url);
	var database_path = __dirname + "/statics/database.json";
	var database, user;
		database=require(database_path);
	var pathname = url.parse(request.url).pathname;
	if (pathname.charAt(pathname.length - 1) == "/") pathname += "index.html";
	if (path.extname(pathname) == ".html") {
		response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		response.write("<!DOCTYPE html>")
		response.write("<link rel='stylesheet' href='statics/sign-up.css' type='text/css' >")
		if (request.method === "POST") {
			var postData = "";
			request.on("data", function (chunk) { postData += chunk; });
			request.on("end", function() {
				var user = JSON.stringify(querystring.parse(postData));
				var uj = JSON.parse(user);
				if (checkUsername(uj["username"]) && checkNumber(uj["number"]) && checkPhone(uj["phone"]) && checkEmail(uj["email"])) {
					if (findUser(database, uj["username"])) {
						response.write("<p class='err-input'>用户名已被占用</p>");
					}
					else if(!checkDuplicate(uj["number"], uj["phone"], uj["email"], response, database)) {
						console.log("Duplication discovered.");
					}
					else regist(database_path, database, user);
				} else {
					if (!checkUsername(uj["username"])) {
						response.write("<p class='err-input'>用户名必须是6-18位英文字母、数字或下划线，且以英文字母开头</p>");
					}
					if (!checkNumber(uj["number"])) {
						response.write("<p class='err-input'>学号必须是8位数字，首位不能为0</p>");
					}
					if (!checkPhone(uj["phone"])) {
						response.write("<p class='err-input'>电话必须是11位数字，首位不能为0</p>");
					}
					if (!checkPhone(uj["email"])) {
						response.write("<p class='err-input'>邮箱格式为example@abc.xyz</p>");
					}
				}
				postData="";
		    	user = findUser(database, username);
				createHead(response, username);
				createBody(response, user, username);
			});
		} else {
		    user = findUser(database, username);
			createHead(response, username);
			createBody(response, user, username);
		}
	}
	pathname = __dirname + pathname;
	fs.readFile(pathname, function (err, data) {
		if (err) {
			if (path.extname(pathname) != ".html") response.end("404 Not Found");
			else response.end();
		} else {
			if (path.extname(pathname) != ".html") {
				response.writeHead(200, {"Content-Type": "text/css"});
				response.end(data);
			}
			else response.end();
		}
	})
}).listen(8000);
console.log("Server running at http://127.0.0.1:8000/");

function parseName(_url) {
	return querystring.parse(url.parse(_url).query).username;
}

// 查找database中的用户，如果找到返回用户数组，否则返回false
function findUser(database, username) {
	var _ul = database["userlists"];
	for(var i = 0; i < _ul.length; i++) {
		if (_ul[i]["username"] == username) return _ul[i];
	}
	return false;
}

// 把传入的_user添加到database的最后
function regist(database_path, database, _user) {
	var new_user = JSON.parse(_user);
	var _ul = database["userlists"];
	_ul[_ul.length] = new_user;
	fs.writeFile(database_path, JSON.stringify(database), function (err) {
		if (err) console.log("Write database failed!");
		else console.log("Write database succeeded.");
	})
}

// 如果username存在，标题显示欢迎，否则显示注册
function createHead(res, username) {
	if (username) {
		res.write("<title>Welcome " + username + "!</title>");
	} else {
		res.write("<title>Register</title>");
	}
}

// 根据未输入用户名、输入未注册的用户名、输入已注册的用户名分别显示不同内容
function createBody(res, user, username) {
	res.write("<div id='sign-up'>");
	res.write("<p id='title'>" + (user ? "详情" : "注册") + "</p>")
	if (!user) {
		res.write("<form action='' method='POST'>"
				+ "用户名"
			    + "<input type='text' id='username' placeholder='abc_123 (6~18位)' name='username' "
				+ (username ? ("value='" + username + "'" + "readonly='readonly'") : "") + ">"
			    + "<br />学　号"
			    + "<input type='text' id='number' placeholder='888888 (8位)' name='number' >"
			    + "<br />电　话"
			    + "<input type='text' id='phone' placeholder='13888888888 (11位)' name='phone' >"
			    + "<br />邮　箱"
			    + "<input type='text' id='email' placeholder='example@gmail.com' name='email' >"
			    + "<br />"
			    + "<input id='reset' type='reset' value='重置' >"
				+ "<input id='submit' type='submit' value='提交'>"
			    + "</form></div>");
	} else {
		res.write("<div id='userinfo'>"
				+ "<p class='info'>用户名：" + user["username"] + "</p>"
				+ "<p class='info'>学　号：" + user["number"] + "</p>"
				+ "<p class='info'>电　话：" + user["phone"] + "</p>"
				+ "<p class='info'>邮　箱：" + user["email"] + "</p>"
				+ "</div>"
		)
	}
}

// 检查各输入的合法性
function checkUsername(username) {
	return /^[a-zA-Z]([a-zA-Z0-9_]{5,17})/.test(username) && (username != undefined);
}
function checkNumber(number) {
	return /^[1-9]([0-9]{7})/.test(number);
}
function checkPhone(phone) {
	return /^[1-9]([0-9]{10})/.test(phone);
}
function checkEmail(email) {
	return /^[a-zA-Z_\-]+@(([a-zA-Z_\-]+\.))+[a-zA-Z]{2,4}$/.test(email);
}

function checkDuplicate(num, ph, em, res, db) {
	console.log(num + " " + ph + " " + em);
	var _ul = db["userlists"];
	var f = true;
	for(var i = 0; i < _ul.length; i++) {
		if (_ul[i]["number"] == num) {
			res.write("<p class='err-input'>学号已被占用</p>");
			f = false;
		}
		if (_ul[i]["phone"] == ph) {
			res.write("<p class='err-input'>电话已被占用</p>")
			f = false;
		}
		if (_ul[i]["email"] == em) {
			res.write("<p class='err-input'>邮箱已被占用</p>")
			f = false;
		}
	}
	return f;
}