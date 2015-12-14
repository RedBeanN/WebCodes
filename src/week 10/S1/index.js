// index.js in S1
$(function() {
  var vals = $('.val'), buttons = $('.button');
  $('#button').hover(function() {
    vals.html('').hide();
    $('#sum').html('').hide();
    buttons.addClass('clickable');
    $('.apb').bind('click', apbHandler);
    $('.button').bind('click', handler);
  });
  $('.apb').bind('click', apbHandler);
  function apbHandler() {
    $('#info-bar').bind('click', infoHandler);
    var f = 0, sum = 0;
    for (var i = 0; i < 5; i++) {
      if (vals[i].innerHTML.toString() != '') {
        f++;
        sum += parseInt(vals[i].innerHTML.toString());
      }
    }
    if (f == 5) $('#info-bar').addClass('clickable');
    else $('#info-bar').removeClass('clickable');
    $('.button').unbind('click').bind('click', handler);
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
  function handler() {
    var cl = this.className[0];
    if (!buttons.find('.' + cl).html()) {
      $('.button').unbind('click').removeClass('clickable');
      $($('.' + cl + ' .val')[0])[0].innerHTML = '···';
      $('.' + cl + ' .val').fadeIn(500);
      $.get('/random/' + cl, function(data, status) {
        if (status == 'success') {
          $($('.' + cl + ' .val')[0])[0].innerHTML = data;
          $('.' + cl + ' .val').fadeIn(300);
          $('.apb').trigger('click');
          for (var i = 0; i < 5; i++) {
            if (vals[i].innerHTML.toString() != '') $(buttons[i]).removeClass('clickable');
            else $(buttons[i]).addClass('clickable');
          }
        }
      });
    }
  }
});