
$(function(){
  var isTutorial = $.cookie("tutorialed");
  if(typeof isTutorial === 'undefined'){
    $('.howto1').css({'opacity': '1'});
    $('.howto1_next').css({'opacity': '1'});
  }else{
    $('.tutorial').remove();
  }
  $('.howto1_next').on('click', function(){
    $('.howto1').css({'opacity': '0'});
    $(this).css({'opacity': '0'});
    $('.howto2').css({'opacity': '1'});
    $('.close').css({'opacity': '1'});
    $('.howto2_back').css({'opacity': '1'});
  });
  $('.close').on('click', function(){
    $('.howto2').css({'opacity': '0'});
    $('.close').css({'opacity': '0'});
    $('.howto2_back').css({'opacity': '0'});
    $.cookie("tutorialed", "looked", { expires: 14 });
    $('.tutorial').remove();
  });
  $('.howto2_back').on('click', function(){
    $('.howto2').css({'opacity': '0'});
    $('.close').css({'opacity': '0'});
    $('.howto2_back').css({'opacity': '0'});
    $('.howto1').css({'opacity': '1'});
    $('.howto1_next').css({'opacity': '1'});
  });
  var fontSize = parseInt($.cookie("font"));
  if(fontSize){
    setFontSize(fontSize);
  }
  
  $('.siorioki').width($('.main').width());
  
  var epi = getEpisode() +'';
  $.cookie("epi_" + epi, "read", { expires: 14 });
  
  var siori_pos = parseInt($.cookie("SIORI" + epi));
  if(siori_pos){
    $('.siori').show();
    $('.siori').css({left: siori_pos});
    $('html,body').animate({scrollLeft: siori_pos-$('.main').width()}, 800, 'swing');
  }
  
  $('.menubar li').each(function(index){
    var i = index + 1;
    if(!$.cookie("epi_" + i)){
      $(this).find(".maru").show();
    }
  });
  
  $('.main').bind('mouseup',function(e) {
    var len = getText().length;
    if(len > 1 && len <= 50){
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
    //var hostUrl= 'http://localhost:8000';
    var hostUrl= 'https://wagahai.herokuapp.com';
    var param1 = getText();
    var param2 = getEpisode();
    if(param1.length > 0 && param1.length <= 50){
      $.ajax({
          url: hostUrl,
          type:'POST',
          dataType: 'json',
          data : {phrase : param1,episode : param2},
          timeout:10000,
      }).done(function(data) {
      }).fail(function() {
      });
      $('.sendButton').hide();
      deSelect();
    }
  });
  $('.siorioki').on('click',function(e){
    var xy = muuXY(e, this);
    $('.siori').show();
    $('.siori').css({left: xy[0]});
    $.cookie("SIORI" + epi, xy[0], { expires: 14 });
  });
  var menuon = false;
  $('.handle-wrapper').on('click',function(){
    if(menuon){
      $('.menubar').css({'top':'-40vh'});
      menuon = false;
    }else{
      $('.menubar').css({'top':'0'});
      menuon = true;
    }
  });
  $('.main').on('click',function(){
    if(menuon){
      $('.menubar').css({'top':'-40vh'});
      menuon = false;
    }
  });
  $('.plus').on('click',function(){
    var f = 1 + parseInt($('p').css('font-size'));
    if(f<25){
      setFontSize(f);
    }
    $('.siorioki').width($('.main').width());
  });
  $('.minus').on('click',function(){
    var f = -1 + parseInt($('p').css('font-size'));
    if(f>15){
      setFontSize(f);
    }
    $('.siorioki').width($('.main').width());
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

function setFontSize(f){
  $('.main p').css({'font-size':f + 'px'});
  $('.main p').css({'letter-space':f*2 + 2 + 'px'});
  $.cookie("font", f, { expires: 14 });
}
