$(function(){
  var hostUrl= 'http://localhost:8000';
  $.ajax({
      url: hostUrl,
      type:'GET',
      timeout:3000,
  }).done(function(data) {
  }).fail(function() {
    alert("error");
  });
  $.ajax({
      url: hostUrl+"/top",
      type:'GET',
      timeout:3000,
  }).done(function(data) {
    data.forEach(function(d){
      var words = d.phrase.split(" ");
      $(".bestPhrase li").eq(d.episode-1).append(makeRuby(words));
    })
  }).fail(function() {
    alert("error");
  });
  $('.read').on('click', function(){
    $('html,body').animate({scrollTop: $('.top').height()}, 800, 'swing');
  });
  $('.episodes li').each(function(index){
    var i = index + 1;
    if(!$.cookie("epi_" + i)){
      $(this).find(".maru").show();
    }
  });
});


function isKanji(c){ // c:判別したい文字
  var unicode = c.charCodeAt(0);
  if ( (unicode>=0x4e00  && unicode<=0x9fcf)  || // CJK統合漢字
       (unicode>=0x3400  && unicode<=0x4dbf)  || // CJK統合漢字拡張A
       (unicode>=0x20000 && unicode<=0x2a6df) || // CJK統合漢字拡張B
       (unicode>=0xf900  && unicode<=0xfadf)  || // CJK互換漢文
       (unicode>=0x3005 && unicode<=0x3006)   || // 々 〆
       (unicode>=0x2f800 && unicode<=0x2fa1f) )  // CJK互換漢字補助
      return true;

  return false;
}

function makeRuby(words){
  var isRuby;
  var ans = "";
  words.forEach(function(word){
    var wo = word.split("");
    isRuby = true;
    
    wo.forEach(function(w){
      if(isKanji(w)){
        isRuby = false;
      }
    });
    if(!isRuby){
      ans+=word;
      console.log(word);
    }
  });
  return ans;
}
