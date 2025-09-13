var videoFixedWidth = 320;
var imageOnPage;

window.onload = function(){

    $('textGuidelineWelcome').hide();
    $('imageContainer').hide();
    $('videoContainer').hide();
    $('soundContainer').hide();


    if(textGuidelineWelcome){
        $('textGuidelineWelcome').show();
        $('textGuidelineWelcome').update(textGuidelineWelcome);
    }

    if(imagePath){
        imageOnPage = document.createElement('img');
        imageOnPage.src = mediasFolder + "/" + imagePath;
        imageOnPage.id = 'imageOnPageId';
        imageOnPage.onload = findHHandWW;
    }


    var theBrowser = detectBrowser();
    
    //video
    if(videoPath){
        if (!videoWidth){
           videoWidth = 320;
        }
            
        if (!videoHeight){
           videoHeight = 240;
        }
        
        var theVideoId = 'indexVideo';
        var theVideoPath = this.mediasFolder + "/" + videoPath;

        var ajustedWidth = videoWidth;
        var ajustedHeight = videoHeight;
            
        var theControls = "";
        var theAutoPlay = "";

        var theControlBar = "bottom";
        var theAutostart = false;
            
        if (showVideoController == true){
           theControls = " controls";
        }
        else{
            ajustedWidth = ajustedWidth;
            theControlBar = "none";
        }
            
        if (autoplayVideo == true){
           theAutostart = true;
           theAutoPlay = " autoplay";
        }
                
                
        htmlVideo = "<video" + theControls + theAutoPlay + " id=\"" + theVideoId + "\" style=\"width:" + ajustedWidth + "px; height:" + ajustedHeight + "px;\">";
        htmlVideo += "<source src=\"" + theVideoPath + "\" type=\"video/mp4\">";
        htmlVideo += "</video>";

        
        //jQuery("#videoContainer").css('margin-left', 'auto');
        //jQuery("#videoContainer").css('margin-right', 'auto');
        
        $('videoContainer').update(htmlVideo);
        $('videoContainer').show();
            
        
        jwplayer(theVideoId).setup({
            autostart: theAutostart,
            controlbar: theControlBar,
            stretching: "exactfit",
            modes: [
                   { type: "flash", src: "scripts/jwplayer/player.swf" },
                   { type: "html5" }
            ]
        });
        
        
        jwplayer(theVideoId).onPlay(function() {
               videoWidth = jwplayer(theVideoId).getMeta()['width'];
               videoHeight = jwplayer(theVideoId).getMeta()['height'];
               
               var maxWidth;
               var maxVideoWidth = 640;
               
               if (videoWidth > maxVideoWidth) {
                   maxWidth = maxVideoWidth;
               }
               else {
                   maxWidth = videoWidth;
               }
               
               var w = videoWidth;
               var h = videoHeight;
               var r = gcd (w, h);
               var arrVideoDimensions = new Array();
                  
               arrVideoDimensions = adjustVideoSize(maxWidth, w/r, h/r);
               videoWidth = arrVideoDimensions[0];
               videoHeight = arrVideoDimensions[1];

               jwplayer(theVideoId).resize(videoWidth, videoHeight);
           });
           
           if (theBrowser.indexOf("Explorer") == -1){
              jQuery("#indexVideo_wrapper").css('border', '1px solid black');
           }
           
           jQuery("#videoContainer").css('display', 'block');
           jQuery("#videoContainer").css('text-align', 'center');
           jQuery("#indexVideo_wrapper").css('display', 'inline-block');
           jQuery("#indexVideo_wrapper").css('display', 'inline-block');
    }

    
    //sound
    if(soundPath){
        var theSoundId = 'indexSound';
        var theSoundPath = this.mediasFolder + "/" + soundPath;
            
        var sWidth = 280;
        var sHeight = 24;
            
            
        if (isMobile.any()) {
           var theControls = "";
           var theAutoPlay = "";
               
            
            if (showSoundController == true){
               theControls = " controls";
            }
               
            if (autoplaySound == true){
                theAutoPlay = " autoplay";
            }
            
            htmlSound = "<audio" + theControls + theAutoPlay + " id=\"" + theSoundId + "\" style=\"width:" + sWidth + "px; height:" + sHeight + "px;\">";
            htmlSound += "<source src=\"" + theSoundPath + "\" type=\"audio/mp3\">";
            htmlSound += "</audio>";
               
            $('soundContainer').update(htmlSound);
            $('soundContainer').show();
        }
        else{
            /*JW NE SUPPORTE PAS ENCORE <audio> 2012-01-01*/
                
            var theControlBar = "bottom";
            var theAutostart = false;
            var theScreenColor = "000000";
                
            if (showSoundController == true){
                document.getElementById('soundContainer').style.width = sWidth + 'px';
                jQuery("#soundContainer").css('margin-left', 'auto');
                jQuery("#soundContainer").css('margin-right', 'auto');
            }
            else{
                sWidth = 1;
                sHeight = 1;
                theScreenColor = "FFFFFF";
                theControlBar = "none";
            }
               
            if (autoplaySound == true){
                theAutostart = true;
            }
                
                
            $('soundContainer').update('<div id="' + theSoundId + '"></div>');
                
            jwplayer(theSoundId).setup({
                width: sWidth,
                height: sHeight,
                autostart: theAutostart,
                controlbar: theControlBar,
                screencolor: theScreenColor,
                flashplayer: "scripts/jwplayer/player.swf",
                file: theSoundPath
            });
            
            $('soundContainer').show();
        }
    
    }
    
    document.body.style.backgroundColor = '#' + bgSkinColor;
}

function findHHandWW(){
    var srcImage = mediasFolder + "/" + imagePath;

    var imgW = this.width;
    var imgH = this.height;
    var imgProp = imgW / imgH;

    $('imageContainer').update(imageOnPage);

    if (imgW > 680){
        var newWidth = 680;
        var newHeight = parseInt(newWidth / imgProp);

        document.getElementById('imageOnPageId').style.width = newWidth + 'px';
        document.getElementById('imageOnPageId').style.height = newHeight + 'px';

        var innerHTMLImg = document.getElementById('imageContainer').innerHTML;
        var newInnerHTMLImg = "<a href=" + srcImage + " class=\"highslide\" onclick=\"return hs.expand(this)\">" + innerHTMLImg + "</a>";
        $('imageContainer').innerHTML = newInnerHTMLImg;
    }

    $('imageContainer').show();

    return true;
}

function gcd(a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}

function adjustVideoSize(maxWidth, widthRation, heightRatio) {
    var arrVideoDimensions = new Array();
    
    var vW = maxWidth;
    var vH;
    
    vH = heightRatio * vW / widthRation;
    vH = parseInt(vH);
    
    arrVideoDimensions[0] = vW;
    arrVideoDimensions[1] = vH;
    
    return arrVideoDimensions;
}

function imgover(){
    document.getElementById('imgGo').src = 'images/skin/btn_go_roll.png';
    document.getElementById('tdGo').style.textDecoration = 'underline';
}

function imgout(){
    document.getElementById('imgGo').src = 'images/skin/btn_go_norm.png';
    document.getElementById('tdGo').style.textDecoration = 'none';
}

function detectBrowser(){
  var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++)  {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {    // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

  };
  BrowserDetect.init();

  return BrowserDetect.browser;
}