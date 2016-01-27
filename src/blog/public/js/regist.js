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
  it.id = validator.getID(it.type);
  if (it.value) {
    if (it.id == 'repeat') {
      var pwd = $('.inputs')[1].children[1].value;
      if (!validator.isRepeatValid(it.value, pwd)) {
        changeErr(it.id, 1, validator.getErrorMessage(it.id));
        return false;
      } else changeErr(it.id, 0);
    } else if (!validator.isFieldValid(it.id, it.value)) {
      changeErr(it.id, 1, validator.getErrorMessage(it.id));
      return false;
    } else changeErr(it.id, 0);
  } else {
    changeErr(it.id, 1, validator.getErrorMessage(it.id));
    return false;
  }
  return true;
}