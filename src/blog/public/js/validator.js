var validator = {
  form: {
    username: {
      status: false,
      errorMessage: '6~18位英文字母、数字或下划线，必须以英文字母开头'
    }, 
    password: {
      status: false,
      errorMessage: '6~12位数字、大小写字母、中划线、下划线'
    }, 
    repeat: {
      status: false,
      errorMessage: '请再次输入密码'
    }, 
    number: {
      status: false,
      errorMessage: '8位数字，不能以0开头'
    }, 
    phone: {
      status: false,
      errorMessage: '11位数字，不能以0开头'
    }, 
    email: {
      status: false,
      errorMessage: '请输入合法邮箱'
    }
  }, 

  isUsernameValid: function (username){
    return this.form.username.status = /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/.test(username);
  },

  isPasswordValid: function (password){
    return this.form.password.status = /^[a-zA-Z0-9-_]{6,12}$/.test(password);
  },

  isRepeatValid: function (repeat, passwd){
    return this.form.repeat.status = (repeat == passwd);
  },

  isNumberValid: function (number){
    return this.form.number.status = /^[1-9]\d{7}$/.test(number);
  },

  isPhoneValid: function (phone){
    return this.form.phone.status = /^[1-9]\d{10}$/.test(phone);
  },

  isEmailValid: function (email){
    return this.form.email.status = /^[a-zA-Z_\-]+@([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isFieldValid: function(fieldname, value, value2){
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    if (fieldname == 'repeat') return this['isRepeatValid'](value, value2);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function(){
    return this.form.username.status && this.form.password.status && this.form.number.status && this.form.phone.status && this.form.email.status;
  },

  getErrorMessage: function(fieldname){
    return this.form[fieldname].errorMessage;
  },

  isAttrValueUnique: function(registry, user, attr){
    if (attr == 'password' || attr == 'repeat') return true;
    for (var key in registry) {
      if (registry[key][attr] == user[attr]) return false;
    }
    return true;
  },

  getID: function(type) {
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
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}
