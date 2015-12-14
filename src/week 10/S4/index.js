// index.js in S4
$(function() {
  var vals = $('.val'), buttons = $('.button');
  var order = {'A':0, 'B':0, 'C':0, 'D':0, 'E':0};
  var start;
  $('#button').hover(function() {
    start = getRandomOrder(order)
    vals.html('').hide();
    $('#sum').html('').hide();
    $('#tips').html('').hide();
    for (var od = start; od != 'info';) {
      $('#tips').html($('#tips').html() + od + ' ');
      console.log(od + ' next: ' + order[od]);
      od = order[od];
    }
    buttons.addClass('clickable');
    $('.apb').bind('click', apbHandler);
    $('.button').unbind('click');
  });
  $('.apb').bind('click', apbHandler);
  function apbHandler(event) {
    $('#info-bar').bind('click', infoHandler);
    var f = 0, sum = 0, clicked = {'A':0, 'B':0, 'C':0, 'D':0, 'E':0};
    console.log(order);
    $('#tips').fadeIn();
    for (var i = 0; i < 5; i++) {
      if (vals[i].innerHTML.toString() != '') {
        f++;
        sum += parseInt(vals[i].innerHTML.toString());
      }
    }
    if (f == 5) $('#info-bar').addClass('clickable');
    else $('#info-bar').removeClass('clickable');
    $('.button').unbind('click').bind('click', handler);
    $('.' + start + '.button').trigger('click', [start, order, clicked]);
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
  function handler(event, pre, order, clicked) {
    var cl = this.className[0];
    if (!buttons.find('.' + cl).html()) {
      $('.button').unbind('click').removeClass('clickable');
      $($('.' + cl + ' .val')[0])[0].innerHTML = '···';
      $('.' + cl + ' .val').fadeIn(500);
      $.get('/random/' + cl, function(data, status) {
        if (status == 'success') {
          clicked[cl] = 1;
          $($('.' + cl + ' .val')[0])[0].innerHTML = data;
          $('.' + cl + ' .val').fadeIn(300);
          $('.apb').trigger('click');
          for (var i = 0; i < 5; i++) {
            if (vals[i].innerHTML.toString() != '') $(buttons[i]).removeClass('clickable');
            else $(buttons[i]).addClass('clickable');
          }
          if (clicked['A'] && clicked['B'] && clicked['C'] && clicked['D'] && clicked['E']) {
            $('#info-bar').trigger('click');
          }
        }
        setTimeout(function() {
          switch(pre) {
            case 'info': break;
            default:
              $('.' + order[pre] + '.button').trigger('click', [order[pre], order, clicked]);
              break;
          }
        }, 0)
      });
    }
  }
});

function getRandomOrder(order) {
  var s = [];
  var unused = [0, 1, 2, 3, 4]
  var tmp = ['A', 'B', 'C', 'D', 'E'];
  var s1, s2;
  for (var i = 4; i > -1; i--) {
    s1 = _.random(0, i);
    s2 = unused[s1];
    unused.splice(s1, 1);
    s.push(s2);
  }
  for (i = 0; i < 4; i++) {
    order[tmp[s[i]]] = tmp[s[i+1]];
  }
  order[tmp[s[4]]] = 'info';
  return tmp[s[0]];
}