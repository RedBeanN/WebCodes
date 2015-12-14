// index.js in S3
$(function() {
  var vals = $('.val'), buttons = $('.button');
  $('#button').hover(function() {
    vals.html('').hide();
    $('#sum').html('').hide();
    buttons.addClass('clickable');
    $('.apb').bind('click', apbHandler);
    $('.button').unbind('click');
  });
  $('.apb').bind('click', apbHandler);
  function apbHandler() {
    $('#info-bar').bind('click', infoHandler);
    var f = 0, sum = 0, s = {'A':0, 'B':0, 'C':0, 'D':0, 'E':0};
    for (var i = 0; i < 5; i++) {
      if (vals[i].innerHTML.toString() != '' && vals[i].innerHTML.toString() != '···') {
        f++;
        sum += parseInt(vals[i].innerHTML.toString());
      }
    }
    if (f == 5) $('#info-bar').addClass('clickable');
    else $('#info-bar').removeClass('clickable');
    $('.button').unbind('click').bind('click', handler).trigger('click', s);
  }
  function infoHandler() {
      var f = 0, sum = 0;
      for (var i = 0; i < 5; i++) {
        if (vals[i].innerHTML.toString() != '') {
          f++;
          sum += parseInt(vals[i].innerHTML.toString());
        }
      }
      if (f == 5) {
        $('#sum').hide();
        $('#sum').html(sum);
        $('#sum').fadeIn(500);
        $('#info-bar').unbind('click').removeClass('clickable');
        $('.apb').unbind('click');
      }
    }
  function handler(event, pre) {
    var cl = this.className[0];
    if (!buttons.find('.' + cl).html()) {
      $($('.' + cl + ' .val')[0])[0].innerHTML = '···';
      $('.' + cl + ' .val').fadeIn(500);
      $.get('/random/' + cl, function(data, status) {
        if (status == 'success') {
          pre[cl]=1;
          $($('.' + cl + ' .val')[0])[0].innerHTML = data;
          $('.' + cl + ' .val').fadeIn(300);
          $('.apb').trigger('click');
          for (var i = 0; i < 5; i++) {
            if (vals[i].innerHTML.toString() != '') $(buttons[i]).removeClass('clickable');
            else $(buttons[i]).addClass('clickable');
          }
          if (pre['A'] && pre['B'] && pre['C'] && pre['D'] && pre['E']) {
            $('#info-bar').trigger('click');
          }
        }
      });
    }
  }
});