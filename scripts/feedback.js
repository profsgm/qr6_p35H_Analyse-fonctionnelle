var feedbackClosedHeight = 35;

window.onresize = function(){
    updateWrappersSize();
}
function updateWrappersSize()
{
    var windowSize = getWindowSize();
    $("allcontentwrapper").style.height = windowSize.h + 'px';
}

function openFeedback(){
    $('feedback').style.backgroundImage = 'url(./images/skin/feedback_header.png)';
    $('btnCloseFeedback').show();
    $('feedbackcontent').show();
    
    addHighSlideToOtherImages('feedback');
}

function closeFeedback(){
    $('feedbackcontent').hide();
    $('feedback').style.backgroundImage = 'none';
    $('btnCloseFeedback').hide();
}

function setFeedback(s){
    $('feedbackcontent').update(s);
}

function hideFeedback(){
    $('feedback').hide();
}

function showFeedback(){
    $('feedback').show();
}

function getWindowSize() {
  var toReturn = {w:0, h:0};
  
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    toReturn.w = window.innerWidth;
    toReturn.h = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    toReturn.w = document.documentElement.clientWidth;
    toReturn.h = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    toReturn.w = document.body.clientWidth;
    toReturn.h = document.body.clientHeight;
  }
  
  return toReturn;
}


/********************/
//FOR RESULTS PAGE
function imgover(which){
    if (which == '1'){
        document.getElementById('imgGo1').src = 'images/skin/btn_go_roll.png';
        document.getElementById('resultButtonRedo').style.textDecoration = 'underline';
    }

    if (which == '2'){
        document.getElementById('imgGo2').src = 'images/skin/btn_go_roll.png';
        document.getElementById('resultButtonPrint').style.textDecoration = 'underline';
    }

    if (which == '3'){
        document.getElementById('imgGo3').src = 'images/skin/btn_go_roll.png';
        document.getElementById('resultButtonCancel').style.textDecoration = 'underline';
    }

    if (which == '4'){
        document.getElementById('imgGo4').src = 'images/skin/btn_go_roll.png';
        document.getElementById('resultButtonOK').style.textDecoration = 'underline';
    }
}

function imgout(which){
    if (which == '1'){
        document.getElementById('imgGo1').src = 'images/skin/btn_go_norm.png';
        document.getElementById('resultButtonRedo').style.textDecoration = 'none';
    }

    if (which == '2'){
        document.getElementById('imgGo2').src = 'images/skin/btn_go_norm.png';
        document.getElementById('resultButtonPrint').style.textDecoration = 'none';
    }

    if (which == '3'){
        document.getElementById('imgGo3').src = 'images/skin/btn_go_norm.png';
        document.getElementById('resultButtonCancel').style.textDecoration = 'none';
    }

    if (which == '4'){
        document.getElementById('imgGo4').src = 'images/skin/btn_go_norm.png';
        document.getElementById('resultButtonOK').style.textDecoration = 'none';
    }
}
/*******************/