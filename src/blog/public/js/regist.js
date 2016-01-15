function changeErr(tg, op, errMsg) {
  var tar;
  switch(tg) {
    case 'username' : tar = '#err-username'; break;
    case 'password' : tar = '#err-password'; break;
    case 'repeat' : tar = '#err-repeat'; break;
    case 'number' : tar = '#err-number'; break;
    case 'phone' : tar = '#err-phone'; break;
    case 'email' : tar = '#err-email'; break;
    default : tar = '.err-input'; // default usually means 'all'
  }
  if (tar != '.err-input') $(tar).html(errMsg);
  $(tar).css('opacity', op);
}

function check(it) {
  it.id = getID(it.type);
  if (it.value) {
    if (it.id == 'repeat') {
      var pwd = $('#password').val();
      if (!validator.isRepeatValid(it.value, pwd)) {
        changeErr(it.id, 1, validator.getErrorMessage(it.id));
      } else changeErr(it.id, 0);
    } else if (!validator.isFieldValid(it.id, it.value)) {
      changeErr(it.id, 1, validator.getErrorMessage(it.id));
    } else changeErr(it.id, 0);
  } else changeErr(it.id, 1, validator.getErrorMessage(it.id));
}

function getID(type) {
  var id;
  switch(type) {
    case '用户名' : id = 'username'; break;
    case '密　码' : id = 'password'; break;
    case '重复密码' : id = 'repeat'; break;
    case '学　号' : id = 'number'; break;
    case '邮　箱' : id = 'email'; break;
    case '电　话' : id = 'phone'; break;
  }
  return id;
}