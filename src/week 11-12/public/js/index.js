$(function() {
  changeErr('all', 0);
  $('input:not(.button)').blur(function() {
    var self = this;
    check(self);
  });
  $('input.button').click(function(){
    $('input:not(.button)').blur();
    if (!validator.isFormValid() && this.type == 'submit') return false;
  });
})


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
  if (it.id == 'repeat') {
    var pwd = $('#password').val();
    if (!validator.isRepeatValid(it.value, pwd)) {
      changeErr(it.id, 1, validator.getErrorMessage(it.id));
    } else changeErr(it.id, 0);
  } else if (!validator.isFieldValid(it.id, it.value)) {
    changeErr(it.id, 1, validator.getErrorMessage(it.id));
  } else changeErr(it.id, 0);
}