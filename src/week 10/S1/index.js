// index.js in S1
$(function() {
  var vals = $('.val'), buttons = $('.button');
  $('#button').hover(function() {
    vals.html('').hide();
    $('#sum').html('');
    buttons.removeClass('disabled');
    $('.apb').trigger('click');
  })
  $('.apb').click(function(event) {
    console.log('apb');
    $('.icon').click(function() {
      var f = 0, sum = 0;
      for (var i = 0; i < 5; i++) {
        if (vals[i].innerHTML.toString() != '') {
          f++;
          sum += parseInt(vals[i].innerHTML.toString());
        }
      }
      if (f == 5) {
        $('#sum').html(sum);
      }
    })
    $('.button').unbind('click').click(function(event) {
      console.log(this.className + ' was clicked');
      var cl = this.className[0];
      if (!buttons.find('.' + cl).html()) {
        $('.button').unbind('click').addClass('disabled');
        $('.' + cl + '.button').removeClass('disabled');
        $($('.' + cl + ' .val')[0])[0].innerHTML = '···';
        $('.' + cl + ' .val').show();
        $.get('/random/' + cl, function(data, status) {
          console.log('status: ' + status);
          console.log('data: ' + data)
          if (status == 'success') {
            $($('.' + cl + ' .val')[0])[0].innerHTML = data;
            $('.' + cl + ' .val').show();
            $('.apb').trigger('click');
            console.log($('.' + cl + '.button').addClass('disabled'));
            for (var i = 0; i < 5; i++) {
              console.log('i=' + i + ' ' + vals[i].innerHTML.toString());
              if (vals[i].innerHTML.toString() != '') $(buttons[i]).addClass('disabled');
              else $(buttons[i]).removeClass('disabled');
            }
          }
        })
      }
    });
  });
});