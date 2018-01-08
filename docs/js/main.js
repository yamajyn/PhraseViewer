
$(function(){
  $('.siorioki').width($('.main').width());
  var siori_pos = parseInt($.cookie("SIORI"));
  if(siori_pos){
    $('.siori').css({left: siori_pos});
    $('.siori').show();
    $(window).scrollLeft(siori_pos);
  }
  $('.main').bind('mouseup',function(e) {
    var len = getText().length;
    if(len > 0 && len < 50){
      var buttonX = e.pageX + 15;
      var buttonY = e.pageY;
      $('.sendButton').animate({ top: buttonY, left: buttonX },0);
      $('.sendButton').show();
    }else{
      $('.sendButton').hide();
      //50文字以内のエラーメッセージ
    }
  });
  $('.sendButton').on('click', function(){
    var hostUrl= 'http://localhost:8000';
    var param1 = getText();
    var param2 = getEpisode();
    $.ajax({
        url: hostUrl,
        type:'POST',
        dataType: 'json',
        data : {phrase : param1,episode : param2},
        timeout:3000,
    }).done(function(data) {
      console.log(param1);
    }).fail(function() {
      alert("error");
    });
    $('.sendButton').hide();
    deSelect();
  });
  $('.siorioki').on('click',function(e){
    var xy = muuXY(e, this);
    $('siori').show();
    $('.siori').css({left: xy[0]});
    $.cookie("SIORI", xy[0], { expires: 14 });
    console.log(xy[0]);
  });
});

function muuXY(e, that) {
    if (!e) e = window.event;
    var x, y;
    if (e.targetTouches) {
        x = e.targetTouches[0].pageX - e.target.offsetLeft;
        y = e.targetTouches[0].pageY - e.target.offsetTop;
    }else if (that){
        x = e.pageX - that.offsetLeft;
        y = e.pageY - that.offsetTop;
    }
    return [x,y];
}


$(function(){
    var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(mousewheelevent,function(e){
        e.preventDefault();
        var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? -(e.originalEvent.wheelDelta) : -(e.originalEvent.detail);
        window.scrollBy(delta,0);
    });
});

function deSelect() {
  if (window.getSelection) {
    var selection = window.getSelection();
    selection.collapse(document.body, 0);
  } else {
    var selection = document.selection.createRange();
    selection.setEndPoint("EndToStart", selection);
    selection.select();
  }
}

function getText() {
    IE='\v'=='v';
    var SelectedText;
    if(IE){
        SelectedText = document.selection.createRange().text;
    }
    else{
        SelectedText = window.getSelection().toString();
    }
    return SelectedText;
}

function getEpisode(){
  return $('input:hidden[name="episode"]').val();
}
