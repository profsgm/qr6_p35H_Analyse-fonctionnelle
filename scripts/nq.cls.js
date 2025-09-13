var Netquiz = Class.create({
    currentPageIndex:0,
    gSoundVolume: 75,
    participantId: -1,
    //servercmdpage: 'srvcmd.php',
    showingResult: false,
    resultNbPagesBFScroll:7,
    imgPreloader: null,
    startingQuiz: true,
    firstLoad: false,
    numberPagesQuiz: 0,
    initializedSequence: false,
    isPageSection: false,
    questionSequence: new Array(),
    indexShuffleStart: new Array(),
    indexShuffleEnd: new Array(),
    pageAdded: new Array(),
    pageInitVal: new Array(),
    numberOfQuestions: null,
    
    //Debut consigne
    /*consigneHeader: '',
    consigneAssociation: '',
    consigneBlankText: '',
    consigneCheckerBoard: '',
    consigneClassement: '',
    consigneDictee: '',
    consigneImagePart: '',
    consigneLongText: '',
    consigneMarquage: '',
    consigneMultipleAnswers: '',
    consigneMultipleChoices: '',
    consigneRanking: '',
    consigneShortText: '',*/
    //Fin consigne
  
    //Dictee
    sMsgMotsMOrtho: "",
    sMsgMotsManq: "",
    sMsgMotsTrop: "",
  
    //msgs
    msgQuizNotExist: null,
    msgQuizInactive: null,
    msgKeyNotExist: null,
    msgKeyUsed: null,
    msgGeneralError: null,
    msgUnonload: null,
    msgRepeatNumEtudiant: null,
    msgModuleError: null,
    msgAddressModuleError: null,
    
    //Labels
    pageLabel: null,
    resultTitle: null,
    goodAnswerLabel: null,
    wrongAnswerLabel: null,
    incompleteAnswerLabel: null,
    solutionLabel: null,
    suggestionLabel: null,
    msgRestartQuiz: null,
    removeHiliteLabel: null,
    
    //Status
    statusToDo: '',
    statusToRedo: '',
    statusCompleted: '',
    
    //Nav Bar
    navbResult: null,
    navbRedo: null,
    navbSolution: null,
    navbValidate: null,
    navBarOf: 'de',
    
    //Result
    resultHeaderCol0: '',
    resultHeaderCol1: '',
    resultHeaderCol2: '',
    resultHeaderCol3: '',
    resultHeaderCol4: '',
    
    resultIdentTitle: '',
    resultButtonRedo: '',
    resultButtonSendTo: '',
    resultButtonPrint: '',
    resultButtonOK: '',
    resultButtonCancel: '',
    
    rifLblLastName: '',
    rifLblName: '',
    rifLblCode: '',
    rifLblGroup: '',
    rifLblEmail: '',
    rifLblOther: '',
    
    resultHTMLVersion: '',
    
    //Settings
    mode:0, /*0 = Preview/Formatif, 1= Formatif w/ submit, 2= Sommatif */
    urlServer: null,
    quizId: null,
    videoFixedWidth: 320,
    showNavTextBox: true,
    resultPageEnabled: true,
    decimalSymbol: 0,
    mediasFolder: 'medias',
    bgSkinColor: '797979',
    quizTitle: '',

    //Timer (each page)
    answerTimerEnabled: false,
    pageTimer: new Array(),
    secs: null,
    timerID: null,
    timerRunning: false,
    delay: 1000,
    
    //user info
    userLastName: '',
    userName: '',
    userCode: '',
    userGroup: '',
    userEmail: '',
    userOther: '',

    //pour zoom image
    imagePathHS: '',
    imgMaxWidth: 550,


    //Construct
    initialize: function(){
        //Hide pour pas avoir de glitch au load du quiz si video dans premiere page
        $('contentwrapper').hide();
        $('btnBackDisabled').hide();
        $('btnNextDisabled').hide();
        $('indice').hide();
        $('resultIdentForm').hide();
        $('scrollwrapper').hide();

        this.pages = new Array();
        this.imgPreloader = getImgPreloader();
    },
    
    //Init
    init: function(){
        document.body.style.backgroundColor = '#' + this.bgSkinColor;  
    
        if (isMobile.Android() == true){
           jQuery("#pagewrapper").removeClass("pagewrapper");
        }

        //Show apres les hide dans initialize
        $('contentwrapper').show();

        this.solutionLabel = '<b>' + this.solutionLabel + '</b>';
        this.suggestionLabel = '<b>' + this.suggestionLabel + '</b>';

        var newPageSequence = new Array();

        for(i = 0;i < this.questionSequence.length;i++){

            this.pageInitVal[i] = this.pages[i];

            for(j = 0;j < this.questionSequence.length;j++){
                if (j == this.questionSequence[i]){
                    newPageSequence[newPageSequence.length] = this.pages[j];
                }
            }
        }

        for(i = 0;i < newPageSequence.length;i++){
            this.pages[i] = newPageSequence[i];
        }

        for(i = 0;i <= this.numberPagesQuiz - 1;i++){
            this.pageTimer[i] = 0;
        }

        if (this.numberOfQuestions){
            for(i = 0;i < this.questionSequence.length;i++){
                if (i >= this.numberOfQuestions){
                    this.pages[i] = null;
                }
            }
            this.pages.length = this.numberOfQuestions;
        }

        //Result
        $('resultHeaderCol0WOT').update(this.resultHeaderCol0);
        $('resultHeaderCol1WOT').update(this.resultHeaderCol1);
        $('resultHeaderCol2WOT').update(this.resultHeaderCol3);
        $('resultHeaderCol3WOT').update(this.resultHeaderCol4);
        
        $('resultHeaderCol0WT').update(this.resultHeaderCol0);
        $('resultHeaderCol1WT').update(this.resultHeaderCol1);
        $('resultHeaderCol2WT').update(this.resultHeaderCol2);
        $('resultHeaderCol3WT').update(this.resultHeaderCol3);
        $('resultHeaderCol4WT').update(this.resultHeaderCol4);
        
        $('resultIdentFormHeader').update(this.resultIdentTitle);
        $('resultButtonRedo').update(this.resultButtonRedo);
        //$('resultButtonSendTo').update(this.resultButtonSendTo);
        $('resultButtonPrint').update(this.resultButtonPrint);
        $('resultButtonOK').update(this.resultButtonOK);
        $('resultButtonCancel').update(this.resultButtonCancel);
        
        $('rifLblLastName').update(this.rifLblLastName);
        $('rifLblName').update(this.rifLblName);
        $('rifLblCode').update(this.rifLblCode);
        $('rifLblGroup').update(this.rifLblGroup);
        $('rifLblEmail').update(this.rifLblEmail);
        $('rifLblOther').update(this.rifLblOther);
        
        //Netquiz Nav bar
        if(this.navbResult)
            $$('#navbResult a')[0].update(this.navbResult);
        
        if(this.navbRedo)
            $$('#navbRedo')[0].update('<a href="javascript:top.ccdmd.nq4.redo();">' + this.navbRedo + '</a>');
        
        if(this.navbSolution)
            $$('#navbSolution')[0].update('<a href="javascript:top.ccdmd.nq4.showSolution();">' + this.navbSolution + '</a>');
        
        if(this.navbValidate)
            $$('#navbValidate')[0].update('<a href="javascript:top.ccdmd.nq4.validate();">' + this.navbValidate + '</a>');
        
        $$('#pagenavbIndice a')[0].update(this.pages[this.currentPageIndex].indiceTag);
        $$('#pagenavbSource a')[0].update(this.pages[this.currentPageIndex].sourceTag);

        $('pageLabel').update(this.pageLabel);

        var navBarOfStr = '&nbsp;' + this.navBarOf + '&nbsp;';
        $('navBarOf').update(navBarOfStr);
        
        if(this.showNavTextBox)
            $('navBarPageIndex').hide();
        else
            $('navBarTxtPageIndex').hide();
        
        if(this.resultPageEnabled)  
            $('navBarPageCount').update(this.pages.length + 1);
        else
            $('navBarPageCount').update(this.pages.length);
        
        $('username').update('&nbsp;');
        updateWrappersSize();
        
        this.imgPreloader.sFolder = this.mediasFolder;
        this.imgPreloader.onFinish = nq4_onImgsPreloadFinish;
        this.imgPreloader.preload();
    },
    
    begin: function(){
        this.pageGoto(0);
        $('scrollwrapper').show();

        //Ass-rank temp "fix"
        if (this.pages[0].question){
            if (this.firstLoad == false){
                this.firstLoad = true;
                this.pageGoto(0);
                this.redo();
                addHighSlideToOtherImages('page');
            }
        }
    },

    initShuffleQuestion: function(indexStart,indexEnd){
        if (this.initializedSequence == false){
            for(i = 0;i <= this.numberPagesQuiz - 1;i++){
                this.questionSequence[i] = i;
            }

            this.indexShuffleStart[this.indexShuffleStart.length] = indexStart;
            this.indexShuffleEnd[this.indexShuffleEnd.length] = indexEnd;

            this.initializedSequence = true;
        }

        var o = new Array();
        var arrayToSort = new Array();

        for(i = indexStart;i <= indexEnd;i++){
            arrayToSort[arrayToSort.length] = this.questionSequence[i];
        }

        o = arrayToSort;

        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

        arrayToSort = o;

        for(i = 0;i < arrayToSort.length;i++){
            this.questionSequence[indexStart + i] = arrayToSort[i];
        }
    },

    restartQuiz: function(){
        var input_box = confirm(this.msgRestartQuiz);

        if (input_box == true){
           window.location.reload();

           /*À GARDER AU CAS OÙ PROBLÈMES AVEC LE RELOAD / SI ON CHANGE D'IDÉE EN AJOUTANT UN PARAMÈTRE*/
           /*var newPageSequence = new Array();

           var o = new Array();
           var arrayToSort = new Array();

           if (this.indexShuffleStart.length > 0){
                for(i = 0;i < this.indexShuffleStart.length;i++){
                    var indShufStart = this.indexShuffleStart[i];
                    var indShufEnd = this.indexShuffleEnd[i];

                    for(j = indShufStart;j <= indShufEnd.length;j++){
                        arrayToSort[arrayToSort.length] = this.pageInitVal[j];
                    }
                }
           }
           else{
               for(i = 0;i < this.questionSequence.length;i++){
                   arrayToSort[arrayToSort.length] = this.pageInitVal[i];
               }
           }

           o = arrayToSort;

           for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

           arrayToSort = o;

           for(i = 0;i < arrayToSort.length;i++){
               this.pages[i] = arrayToSort[i];
               newPageSequence[newPageSequence.length] = this.pages[i];
           }


           var indexEndPages;

           if (this.numberOfQuestions){
               indexEndPages = this.numberOfQuestions;
           }
           else{
               indexEndPages = this.numberPagesQuiz;
           }

           for(i = 0;i <= indexEndPages - 1;i++){
               this.pageTimer[i] = 0;

               if(this.pages[i].question){
                   this.pages[i].question.triesCount = 0;
                   this.pages[i].question.redoQuiz();
               }
           }

           if (this.numberOfQuestions){
               for(i = 0;i < this.questionSequence.length;i++){
                   if (i >= this.numberOfQuestions){
                       this.pages[i] = null;
                   }
               }
               this.pages.length = this.numberOfQuestions;
           }

           this.pageGoto(0); */
        }
    },
    
    connect: function(){
        /*if((this.urlServer.substr(0,7) != 'http://') || (this.urlServer.length == 0) || (this.urlServer.replace('http://','').length == 0)){
            $('msgErreur').update(this.msgAddressModuleError);
            return;
        }
    
        var url = this.urlServer + '/' + this.servercmdpage + '?cmd=checkstatus';
        var params = {
           qidentifier: this.quizId
        };
        
        new Ajax.Request(url, {
           method: 'post',
           parameters: params,
           asynchronous: true,
           onSuccess: nq4_onConnectSuccess,
           encoding: 'ISO-8859-1'
        });*/
    },
    
    connectSuccess: function(transport){
        /*var response = transport.responseJSON;
        
        var serverMsg = response.msg;
        
        switch(serverMsg){
            case 0:
                $('msgErreur').update(this.msgQuizNotExist);
                break;
            case 1:
                //exist and active
                break;
            case 2:
                $('msgErreur').update(this.msgQuizInactive);
                break;
        }*/
    },
    
    auth: function(){
        
    },
    
    authSuccess: function(transport){
        var response = transport.responseJSON;
       
        var serverMsg = response.msg;
        switch(serverMsg){
            case 0:
                $('pagewrapperauth').hide();
                $('pagewrapperquiz').show();
                this.participantId = response.participantId;
                $('username').update(response.username);
                
                window.onbeforeunload = tcals_onunload;
                
                if(response.questionNb == -1)
                    this.pageGoto(0);
                else
                    this.resume(response.questionNb);
                break;
            case 1:
                $('msgErreur').update(this.msgKeyNotExist);
                break;
            case 2:
                $('msgErreur').update(this.msgKeyUsed);
                break;
            case 3:
                $('msgErreur').update(this.msgGeneralError);
                break;
        }
    },
    
    //Navbar
    newPage: function(){
        this.pages[this.pages.length] = new Page(this);
        return this.pages[this.pages.length - 1];
    },
    
    pageNext: function(){
        if(this.resultPageEnabled){
            if(this.currentPageIndex < (this.pages.length))
                this.pageGoto(this.currentPageIndex + 1);
        }else{
            if(this.currentPageIndex < (this.pages.length - 1))
                this.pageGoto(this.currentPageIndex + 1);
        }
    },
    pageBack: function(){
        if(this.currentPageIndex > 0)
            this.pageGoto(this.currentPageIndex - 1);
    },
    pageGoto: function(pageIndex){
        if(pageIndex > -1 && pageIndex < this.pages.length){
            $('quizpage').style.height = '';
            $('feedbackcontent').innerHTML = '';     

            if(!this.showingResult)
                if (this.startingQuiz == false)
                   this.savePage();
                else
                   this.startingQuiz = false;
             
            this.hideResultIdentForm();
            indiceWindow.close();
            showFeedback();
            closeFeedback();
            this.displayPage(this.pages[pageIndex]);
            this.currentPageIndex = pageIndex;
            addHighSlideToOtherImages('page');
        }else if (pageIndex == this.pages.length && this.resultPageEnabled){
            $('quizpage').style.height = '';
            $('feedbackcontent').innerHTML = ''; 
        
            if(!this.showingResult)
                this.savePage();
            
            this.hideResultIdentForm();
            indiceWindow.close();
            closeFeedback();
            this.displayResultPage();
            this.currentPageIndex = pageIndex;
        }
    },
    pageGotoResult: function(){
        if (this.resultPageEnabled){
            if(!this.showingResult)
                    this.savePage();
                
            indiceWindow.close();
            closeFeedback();
            this.displayResultPage();
            this.currentPageIndex = this.pages.length;
        }
    },
    resume: function(questionNb){
        var questionAt = 0;
        var thePage;

        for(i = 0;i < this.pages.length;i++){

              thePage = this.pages[i];

              if (thePage.question){
                 if (questionAt == questionNb){
                    this.pageGoto(i);
                    return;
                 }
                 else{
                     questionAt = questionAt + 1;
                 }
              }
        }
    },
    redo: function(){
        var currentPage = this.pages[this.currentPageIndex];

        currentPage.redo();
        
        this.updateNavBar(currentPage);
    },
    validate: function(){
        var currentPage = this.pages[this.currentPageIndex];
        
        currentPage.validate();
        
        this.updateNavBar(currentPage);        
        
        var element = document.getElementById('feedback');
        element.scrollIntoView(true);

    },
    showSolution: function(){
        var currentPage = this.pages[this.currentPageIndex];
        
        currentPage.showSolution();
        
        
        var element = document.getElementById('feedback');
        element.scrollIntoView(true);
    },
    
    showIndice: function(){
        var indiceBR = "<div style='width:200px;height:15px;background-image:none'></div>" + this.pages[this.currentPageIndex].indice + "<div style='width:200px;height:40px;background-image:none'></div>";

        $$('#indiceheader span')[0].update(this.pages[this.currentPageIndex].indiceTag);
        $$('#indicewrapper div')[0].update(indiceBR);

        /*AVANT NETQUIZ TABLETTE, CHANGER DE PLAYER*/
        /*
        if (this.pages[this.currentPageIndex].videoPath)
           $('videoInPage').hide();

        if (this.pages[this.currentPageIndex].soundPath)
           $('theSound').hide();*/

        indiceWindow.open('indice');

    },

    showSource: function(){
        var sourceBR = "<div style='width:200px;height:15px;background-image:none'></div>" + this.pages[this.currentPageIndex].source + "<div style='width:200px;height:40px;background-image:none'></div>";

        $$('#indiceheader span')[0].update(this.pages[this.currentPageIndex].sourceTag);
        $$('#indicewrapper div')[0].update(sourceBR);

        /*AVANT NETQUIZ TABLETTE, CHANGER DE PLAYER*/
        /*
        if (this.pages[this.currentPageIndex].videoPath)
           $('videoInPage').hide();

        if (this.pages[this.currentPageIndex].soundPath)
           $('theSound').hide();*/

        indiceWindow.open('indice');

    },

    showConsigne: function(){
        var consigneBR = "<div style='width:200px;height:15px;background-image:none'></div>" + this.pages[this.currentPageIndex].consigne + "<div style='width:200px;height:40px;background-image:none'></div>";

        $$('#indiceheader span')[0].update(this.pages[this.currentPageIndex].readableType);
        $$('#indicewrapper div')[0].update(consigneBR);

        /*AVANT NETQUIZ TABLETTE, CHANGER DE PLAYER*/
        /*
        if (this.pages[this.currentPageIndex].videoPath)
            $('videoInPage').hide();

        if (this.pages[this.currentPageIndex].soundPath)
           $('theSound').hide();*/

        indiceWindow.open('indice');

    },
    
    //Private
    savePage: function(){
        var currentPage = this.pages[this.currentPageIndex];

        if (currentPage.question){
            var answer = currentPage.question.save();
            
            if (!this.previewMode){
                var url = this.urlServer + '/' + this.servercmdpage + '?cmd=save';
                var params = {
                    participantId: this.participantId,
                    questionNb: currentPage.question.questionNb,
                    value: answer
                }
                        
                /*new Ajax.Request(url, {
                    method: 'post',
                    parameters: params,
                    asynchronous: false,
                    encoding: 'ISO-8859-1'
                });*/
            }
        }
    },

    displayPage: function(page){
        var theBrowser = detectBrowser();

        $('videoContainer').style.paddingBottom = '0px';
        $('soundContainer').style.paddingBottom = '0px';
        $('imageContainer').style.paddingBottom = '0px';

        $('navbSep3_1').show();
        $('navbSep3_2').show();
        $('navbSep3_3').show();

        $('quizpage').show();
        $('resultpage').hide();

        this.showingResult = false;
    
        this.resetLayout();

        if (page.title){
            $('pageTitle').update(page.title);
            $('pageTitleContainer').show();
            $('pagenavbar').style.marginTop = '0px';

            if (page.question){
                if(page.imagePath || page.videoPath){
                    $('pagecontent').style.marginTop = '38px';
                }
                else{
                    $('pagecontent').style.marginTop = '28px';
                }
            }
            else{
                if (theBrowser.indexOf("Safari") != -1 || theBrowser.indexOf("safari") != -1){
                     $('pagecontent').style.marginTop = '65px';
                }
                else{
                     $('pagecontent').style.marginTop = '68px';
                }   
            }
        }
        else{
            $('pageTitle').update('&nbsp;');
            $('pageTitleContainer').hide();
            $('pagenavbar').style.marginTop = '-2px';

            if (page.question){
                if (theBrowser.indexOf("Safari") != -1 || theBrowser.indexOf("safari") != -1){
                     $('pagecontent').style.marginTop = '52px';
                }
                else{
                     $('pagecontent').style.marginTop = '54px';
                }   
            }
            else{
                $('pagecontent').style.marginTop = '70px';
            }
        }

        //statement
        if(page.statement){
            $('statement').show();
            $('statement').update(page.statement);
        }

        //guideline
        if(page.textGuideline){
            $('textGuidelinequiz').show();
            $('textGuidelinequizSep').show();
            $('textGuidelinequiz').update(page.textGuideline);
        }

        //image
        if(page.imagePath){
            var srcImage = this.mediasFolder + "/" + page.imagePath;
            this.imagePathHS = srcImage;

            var myImage = new Image(); 
            myImage.name = srcImage;
            myImage.onload = findHHandWW;
            myImage.src = srcImage;
        }

        //sound
        if(page.soundPath){
            var theSoundId = 'soundInPage' + parseInt(this.currentPageIndex); //START AT 0
            var theSoundPath = this.mediasFolder + "/" + page.soundPath;
            
            var sWidth = 280; 
            var sHeight = 24;
            
            
            if (isMobile.any()) {
               var theControls = "";
               var theAutoPlay = "";
               
            
               if (page.showSoundController == true){
                  theControls = " controls";
               }
               
               if (page.autoplaySound == true){
                   theAutoPlay = " autoplay";
               }
            
               htmlSound = "<audio" + theControls + theAutoPlay + " id=\"" + theSoundId + "\" style=\"width:" + sWidth + "px; height:" + sHeight + "px;\">";
               htmlSound += "<source src=\"" + theSoundPath + "\" type=\"audio/mp3\">";
               htmlSound += "</audio>";
               
               $('soundContainer').update(htmlSound);
               $('soundContainer').show();
            }
            else{
                /*JW NE SUPPORTE PAS ENCORE <audio>*/
                
                var theControlBar = "bottom";
                var theAutostart = false;
                var theScreenColor = "000000";
                
                if (page.showSoundController == true){
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
               
                if (page.autoplaySound == true){
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

        //video
        if(page.videoPath){
            if (!page.videoWidth){
               page.videoWidth = 320;
            }
            
            if (!page.videoHeight){
               page.videoHeight = 240;
            }
        
            var theVideoId = 'videoInPage' + parseInt(this.currentPageIndex); //START AT 0
            var theVideoPath = this.mediasFolder + "/" + page.videoPath; 

            var ajustedWidth = page.videoWidth; //this.videoFixedWidth; //plus besoin de ca : les dimensions des videos sont passés uniquement par page.videoWidth et page.videoHeight
            var ajustedHeight = page.videoHeight; //((this.videoFixedWidth / page.videoWidth) * page.videoHeight); //plus besoin de ca : les dimensions des videos sont passés uniquement par page.videoWidth et page.videoHeight
            
            var theControls = "";
            var theAutoPlay = "";

            var theControlBar = "bottom";
            var theAutostart = false;
            
            
            if (page.showVideoController == true){
                theControls = " controls";
            }
            else{
                ajustedWidth = ajustedWidth;
                theControlBar = "none";
            }
            
            if (page.autoplayVideo == true){
               theAutostart = true;
               theAutoPlay = " autoplay";
            }
                
                
            htmlVideo = "<video" + theControls + theAutoPlay + " id=\"" + theVideoId + "\" style=\"width:" + ajustedWidth + "px; height:" + ajustedHeight + "px;\">";
            htmlVideo += "<source src=\"" + theVideoPath + "\" type=\"video/mp4\">";
            htmlVideo += "</video>";
            

            //document.getElementById('videoContainer').style.width = ajustedWidth + 'px';
            
            if (theBrowser.indexOf("Explorer") == -1){
                jQuery("#videoContainer").css('border', '1px solid black');
            }
            
            jQuery("#videoContainer").css('margin-left', 'auto');
            jQuery("#videoContainer").css('margin-right', 'auto');
            
            //document.getElementById('videoContainer').style.height = ajustedHeight + 'px';
            $('videoContainer').update(htmlVideo);
            $('videoContainer').show();
            
            
            jQuery("#videoContainer").css('border', '');
            
            jwplayer(theVideoId).setup({
                width: '640px',
                height: '360px',
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
                   
                   document.getElementById('videoContainer').style.width = videoWidth + 'px';
                   
                   jQuery("#videoContainer").css('border', '1px solid black');
               });
               
               if (!jQuery.browser.msie){
                  jQuery("#videoContainer2").css('border', '1px solid black');
               }
        }

        //ADD PADDING TO LAST MEDIA
        if (page.videoPath){
            jQuery("#videoContainer").css('margin-bottom', '20px');
        }
        else if (page.soundPath){
            jQuery("#soundContainer").css('margin-bottom', '20px');
        }
        else if (page.imagePath){
            jQuery("#imageContainer").css('margin-bottom', '20px');
        }

        if(page.question)
            page.question.display();

        this.updateNavBar(page);

        //Remove if not a question
        if(!page.question){
            this.isPageSection = true;

            if(this.navbRedo)
                $$('#navbRedo')[0].update('<font class="navBarDisabled">' + this.navbRedo + '</font>');
        
            if(this.navbSolution)
                $$('#navbSolution')[0].update('<font class="navBarDisabled">' + this.navbSolution + '</font>');
        
            if(this.navbValidate)
                $$('#navbValidate')[0].update('<font class="navBarDisabled">' + this.navbValidate + '</font>');


            $('feedback').style.backgroundImage = 'none';
            $('feedback').hide();
            $('feedbackcontent').innerHTML = '';
            $('btnCloseFeedback').hide();

            $('pagenavbar').hide();
            
            $('containerMarquage').update('');
            $('containerMarquage').hide();
        }
        else{
            this.isPageSection = false;

            if(this.navbRedo)
                $$('#navbRedo')[0].update('<a href="javascript:top.ccdmd.nq4.redo();">' + this.navbRedo + '</a>');
        
            if(this.navbSolution)
                $$('#navbSolution')[0].update('<a href="javascript:top.ccdmd.nq4.showSolution();">' + this.navbSolution + '</a>');
        
            if(this.navbValidate)
                $$('#navbValidate')[0].update('<a href="javascript:top.ccdmd.nq4.validate();">' + this.navbValidate + '</a>');


            if (page.showNavBSolution)
                $('navbSolution').show();
            else
                $('navbSolution').hide();

            $('navbValidate').show();

            $('pagenavbar').show();
        }

        updateWrappersSize();


        if (this.answerTimerEnabled)
            InitializeTimer();
        
        //CSS visibility:hidden... On met visibility par défaut par la suite. Pour régler loading "glith"...
        if (jQuery("#pageTitleContainer").hasClass("clsVisibilityHidden")) {
           jQuery("#navbar").removeClass("clsVisibilityHidden");
           jQuery("#pageTitleContainer").removeClass("clsVisibilityHidden");
           jQuery("#pagenavbar").removeClass("clsVisibilityHidden");
           jQuery("#statement").removeClass("clsVisibilityHidden");
           jQuery("#wrapperMarquage").removeClass("clsVisibilityHidden");
           jQuery("#textGuidelinequizSep").removeClass("clsVisibilityHidden");
           jQuery("#feedback").removeClass("clsVisibilityHidden");
           jQuery("#resultpage").removeClass("clsVisibilityHidden");
        }
    },
    
    updateNavBar: function(page){
        var presentBar = false;
    
        //***Quiz navbar***
        $('navbResult').show();
        $('navbRedo').show();
        $('navbValidate').show();

        if(page.lastPage){
            $('navbar').update('');
            return;
        }   

        //back
        if(page.pageBackEnabled){
            $('btnBackEnabled').show();
            $('btnBackDisabled').hide();
        }else{
            $('btnBackEnabled').hide();
            $('btnBackDisabled').show();
        }
        
        //index
        pageIndex = this.pages.indexOf(page);
        $('navBarPageIndex').update(pageIndex + 1);
        $('navBarTxtPageIndex').value = (pageIndex + 1);
        
        //next
        if(page.pageNextEnabled){
            $('btnNextEnabled').show();
            $('btnNextDisabled').hide();
        }else{
            $('btnNextEnabled').hide();
            $('btnNextDisabled').show();
        }

        //solution
        if (page.showNavBSolution)
            $('navbSolution').show();
        else
            $('navbSolution').hide();
        
        //***Page navbar***
        //type

        if(page.readableType){
            presentBar = true;
            $('pagenavbScore').style.background = 'url(./images/skin/pagechoicesep.png) no-repeat left';
            $('pagenavbScore').style.paddingLeft = '21px';
            $('pagenavbType').show();
            $$('#pagenavbType a')[0].update(page.readableType);
        }
        else{
            $('pagenavbScore').style.background = '';
            $('pagenavbScore').style.paddingLeft = '0px';
            $('pagenavbType').hide();
        }
            
        //current score
        if(page.question){
            var strPoints;
            var roundedScore = Math.round(page.question.currentScore * 100) / 100;
            var formatPonderation = page.question.ponderation;

            if (this.decimalSymbol == 0){
                roundedScore = changeDecimalSymbol(roundedScore, ",");
                formatPonderation = changeDecimalSymbol(formatPonderation, ",");
            }

            if (page.question.ponderation > 1)
                strPoints = "points";
            else
                strPoints = "point";

           $('pagenavbScore').update(roundedScore + '&nbsp;/&nbsp;' + formatPonderation + '&nbsp;' + strPoints);
        }

        if(page.indiceTag){
            presentBar = true;
            $('pagenavbIndice').show();
            $$('#pagenavbIndice a')[0].update(page.indiceTag);
        }
        else{
            $('pagenavbIndice').hide();
        }
        
        if(page.sourceTag){
            presentBar = true;
            $('pagenavbSource').show();
            $$('#pagenavbSource a')[0].update(page.sourceTag);
        }
        else{
            $('pagenavbSource').hide();
        }

        if (presentBar == false){
            $('pagenavbar').style.paddingTop = '2px';
        }
        else{
            $('pagenavbar').style.paddingTop = '0px';
        }
        
    },
    
    resetLayout: function(){
        $('statement').hide();
        $('textGuidelinequiz').hide();
        $('textGuidelinequizSep').hide();

        $('question').update('');

        $('imageContainer').update('');
        $('imageContainer').hide();

        $('videoContainer').update('');
        $('videoContainer').hide();

        $('soundContainer').update('');
        $('soundContainer').hide();
        
        $('containerMarquage').update('');
        $('wrapperMarquage').hide();
    },
    
    displayResultPage: function(){
        if (this.answerTimerEnabled){
            InitializeTimer();
            StopTheClock();
        }
        
        $('navbResult').hide();
        $('navbRedo').hide();
        $('navbSolution').hide();
        $('navbValidate').hide();
        $('feedback').style.backgroundImage = 'none';
        $('btnCloseFeedback').hide();

        $('navbSep3_1').hide();
        $('navbSep3_2').hide();
        $('navbSep3_3').hide();

        $('quizpage').hide();
        
        $('containerMarquage').update('');
        $('containerMarquage').hide();
            
        $('resultpage').show();
        
        this.showingResult = true;
        $('navBarPageIndex').update(this.pages.length + 1);
        $('navBarTxtPageIndex').value = this.pages.length + 1;
        
        $('resulttitle').update(this.resultTitle);
        
        var currRow = null;
        var currCell = null;

        //?
        var lastRowWidth = (this.pages.length > this.resultNbPagesBFScroll? 211 : 208);
        
        if(this.answerTimerEnabled){
            lastRowWidth -= 99;
            $('resultWtimer').update();
            $('resultWOtimer').hide();
            $('resultheaderWOtimer').hide();
            $('resultcontentWOtimer').hide();
        }else{
            $('resultWOtimer').update();
            $('resultWtimer').hide();
            $('resultheaderWtimer').hide();
            $('resultcontentWtimer').hide();
        }
        
        var totalPond = 0;
        var totalScore = 0;

        if (this.pages.length > 8){
            if(this.answerTimerEnabled)
                $('resultcontentWtimer').style.width = 591 + 'px';
            else
                $('resultcontentWOtimer').style.width = 584 + 'px';
        }


        for($i = 0;$i < this.pages.length;$i++){
            var currPage = this.pages[$i];
        
            var pageNumber = $i + 1;
            var triesCount = '-';
            var answerTime = '-';
            var score = '-';
            var status = '-';
            
            if(currPage.question){
                if (currPage.question.triesCount > 0){
                    var nbSeconds = Math.round(this.pageTimer[$i] / 100);  //Data in seconds
                    var minVar = Math.floor(nbSeconds / 60);  // The minutes
                    var secVar = nbSeconds % 60;  // The balance of seconds

                    if (secVar >= 10)
                        answerTime = minVar + ":" + secVar;
                    else
                        answerTime = minVar + ":0" + secVar;
                }

                triesCount = currPage.question.triesCount;


                var roundedCurrentScore = Math.round(currPage.question.currentScore * 100) / 100;

                if (this.decimalSymbol == 0)
                    score = changeDecimalSymbol(roundedCurrentScore,",") + ' / ' + changeDecimalSymbol(currPage.question.ponderation,",");
                else
                    score = roundedCurrentScore + ' / ' + currPage.question.ponderation;

                if (triesCount == 0)
                    status = this.statusToDo;
                else
                    status = currPage.question.status;
                
                totalPond += currPage.question.ponderation;
                totalScore += currPage.question.currentScore;
            }
            
            //Populate Table
            if(this.answerTimerEnabled)
                currRow = $('resultWtimer').insertRow($i);
            else
                currRow = $('resultWOtimer').insertRow($i);
            
            //pageNumber col
            currCell = currRow.insertCell(0);
            currCell.style.width = 99 + 'px';

            currCell.innerHTML = '<a href="javascript:top.ccdmd.nq4.pageGoto(' + (pageNumber-1) + ')">' + pageNumber + '</a>';
            
            //triesCount col
            currCell = currRow.insertCell(1);
            currCell.style.width = 138 + 'px';
            currCell.innerHTML = triesCount;
            
            var nextCellId = 2;
            if(this.answerTimerEnabled){
                currCell = currRow.insertCell(nextCellId);
                currCell.style.width = 119 + 'px';
                currCell.innerHTML = answerTime;
                nextCellId++;
            }
            
            //score col
            currCell = currRow.insertCell(nextCellId);
            currCell.style.width = 99 + 'px';
            currCell.innerHTML = score;
            nextCellId++;
            
            //status col
            currCell = currRow.insertCell(nextCellId);

            if(this.answerTimerEnabled){
                currCell.style.width = 115 + 'px';
            }
            else{
                currCell.style.width = 228 + 'px';
            }

            currCell.style.textAlign = 'left';
            currCell.style.paddingLeft = '15px';
            currCell.innerHTML = status;
        }

        totalScore =  Math.round(totalScore * 100) / 100;
        var totalScorePC = Math.round(totalScore / totalPond * 100,2);

        if (this.decimalSymbol == 0){
            totalScore = changeDecimalSymbol(totalScore, ",");
            totalPond = changeDecimalSymbol(totalPond, ",");
            totalScorePC = changeDecimalSymbol(totalScorePC, ",");
        }
        
        var resultTitle = '<b>' + this.navbResult + '</b>' + "&nbsp;&nbsp;" + totalScore + "&nbsp;/&nbsp;" + totalPond + "&nbsp;&nbsp;(" + totalScorePC + "&nbsp;%)";
        $('resulttitle').update(resultTitle);

        hideFeedback();

        if (isMobile.any()) {
            $('resultButtonPrint').hide();
            $('imgGo2').hide();
            $('nothing').update('');
            $('nothing').hide();
            
            jQuery('#resultButtons').css('width', '606px');
        }
    },
    
    showResultIdentForm: function(){
        var width = $('resultIdentForm').getWidth();
        var height = $('resultIdentForm').getHeight();

        var screenVisibleW = document.getElementById('pagewrapper').offsetWidth / 2;
        var screenVisibleH = document.getElementById('pagewrapper').offsetHeight / 4;
        
        var indiceW = width / 2;
        var left = screenVisibleW - indiceW;

        $('txtrifLastName').value = this.userLastName;
        $('txtrifName').value = this.userName;
        $('txtrifCode').value = this.userCode;
        $('txtrifGroup').value = this.userGroup;
        $('txtrifEmail').value = this.userEmail;
        $('txtrifOther').value = this.userOther;

       
        $('resultIdentForm').style.left = left + 'px';;
        $('resultIdentForm').style.top = '135px';

        $('resultIdentForm').show();
    },
    
    hideResultIdentForm: function(){
        $('resultIdentForm').hide();
    },
    
    resultIdentFormOK: function(){
        this.userLastName = $F('txtrifLastName');
        this.userName = $F('txtrifName');
        this.userCode = $F('txtrifCode');
        this.userGroup = $F('txtrifGroup');
        this.userEmail = $F('txtrifEmail');
        this.userOther = $F('txtrifOther');
        
        $('resultIdentForm').hide();
        this.updateHTMLVersion();

        var url = 'printable.html';
        var width = 700;
        var height = 600;
        var left = parseInt((screen.availWidth/2) - (width/2));
        var top = parseInt((screen.availHeight/2) - (height/2));
        var windowFeatures = "width=" + width + ",height=" + height + ",resizable,scrollbars,status,toolbar,menubar,left=" + left + ",top=" + top + ",screenX=" + left + ",screenY=" + top;

        window.open(url, "printable", windowFeatures);
    },
    
    resultIdentFormCancel: function(){
        this.hideResultIdentForm();
    },
    
    updateHTMLVersion: function(){
        var n = new Date();
        var theMonth;
        var theDay;
        var theMinutes;

        theMonth = (n.getMonth()+1);
        theDay = n.getDate();
        theMinutes = n.getMinutes();

        if (theMonth < 10)
            theMonth = "0" + theMonth;

        if (theDay < 10)
            theDay = "0" + theDay;

        if (theMinutes < 10)
            theMinutes = "0" + theMinutes;


        this.resultHTMLVersion = '';
        this.resultHTMLVersion += '<strong><font style="font-size:22pt">' + this.quizTitle + '</font></strong>&nbsp;&nbsp;&nbsp;' + n.getFullYear() + '-' + theMonth + '-' + theDay + '&nbsp;' + n.getHours() + 'h' + theMinutes + '<br /><br />';

        if (this.userLastName && !this.userName)
            this.resultHTMLVersion += '<strong>' + this.rifLblLastName + ' :  ' + this.userLastName + '</strong><br />';

        if (this.userLastName && this.userName)
            this.resultHTMLVersion += '<strong>' + this.rifLblLastName + ',&nbsp;' + this.rifLblName + '</strong> : ' + this.userLastName + ',&nbsp;' + this.userName + '<br />';

        if (!this.userLastName && this.userName)
            this.resultHTMLVersion += '<strong>' + this.rifLblName + ' :  ' + this.userName + '</strong><br />';

        if (this.userGroup)
            this.resultHTMLVersion += '<strong>' + this.rifLblGroup + '</strong> : ' + this.userGroup + '<br />';

        if (this.userCode)
            this.resultHTMLVersion += '<strong>' + this.rifLblCode + '</strong> : ' + this.userCode + '<br />';

        if (this.userEmail)
            this.resultHTMLVersion += '<strong>' + this.rifLblEmail + '</strong> : ' + this.userEmail + '<br />';

        if (this.userOther)
            this.resultHTMLVersion += '<strong>' + this.rifLblOther + '</strong> : ' + this.userOther + '<br />';
        
        this.resultHTMLVersion += '<br /><hr><br /><br />';
        
        this.resultHTMLVersion += '<strong>' + $('resulttitle').innerHTML + '</strong><br /><br />';


        if(this.answerTimerEnabled){
            this.resultHTMLVersion += '<table cellspacing="0" cellpadding="0" border="0" class="resultheader" id="resultheaderWtimer">' + $('resultheaderWtimer').innerHTML + '</table>';
            this.resultHTMLVersion += $('resultcontentWtimer').innerHTML;
        }
        else{
            this.resultHTMLVersion += '<table cellspacing="0" cellpadding="0" border="0" class="resultheader" id="resultheaderWOtimer">' + $('resultheaderWOtimer').innerHTML + '</table>';
            this.resultHTMLVersion += $('resultcontentWOtimer').innerHTML;
        }


        for($i = 0;$i < this.pages.length;$i++){
            var currPage = this.pages[$i];

            var pageNumber = $i + 1;
            var triesCount = '-';
            var answerTime = '-';
            var score = '-';
            var status = '-';

            if(currPage.question){
                if (currPage.question.triesCount > 0){
                    var nbSeconds = Math.round(this.pageTimer[$i] / 100);  //Data in seconds
                    var minVar = Math.floor(nbSeconds / 60);  // The minutes
                    var secVar = nbSeconds % 60;  // The balance of seconds

                    if (secVar >= 10)
                        answerTime = minVar + ":" + secVar;
                    else
                        answerTime = minVar + ":0" + secVar;
                }

                triesCount = currPage.question.triesCount;

                if (this.decimalSymbol == 0)
                    score = changeDecimalSymbol(currPage.question.currentScore,",") + ' / ' + changeDecimalSymbol(currPage.question.ponderation,",");
                else
                    score = currPage.question.currentScore + ' / ' + currPage.question.ponderation;

                status = currPage.question.status;
            }

            //IE
            var stringReplace = "<A href=\"" + "javascript:top.ccdmd.nq4.pageGoto(" + $i + ")\">";
            this.resultHTMLVersion = this.resultHTMLVersion.replace(stringReplace,"");

            stringReplace = "</A>";
            this.resultHTMLVersion = this.resultHTMLVersion.replace(/stringReplace/g,"");


            //firefox
            stringReplace = "<a href=\"" + "javascript:top.ccdmd.nq4.pageGoto(" + $i + ")\">";
            this.resultHTMLVersion = this.resultHTMLVersion.replace(stringReplace,"");

            stringReplace = "</a>";
            this.resultHTMLVersion = this.resultHTMLVersion.replace(/stringReplace/g,"");
        }
    },
    
    resultPrint: function(){
        this.showResultIdentForm();
    },
    
    resultSendTo: function(){},
    
    submit: function(){
        window.onbeforeunload = null;
        
        if (!this.previewMode){
            var url = this.urlServer + '/' + this.servercmdpage + '?cmd=submit';
            var params = {
                participantId: this.participantId
            }
                        
            new Ajax.Request(url, {
                method: 'post',
                parameters: params,
                asynchronous: false,
                encoding: 'ISO-8859-1'
            });
        }
    },
    
    timerFinish: function(){
       this.pageNext(false);
    },
    
    onunload: function(){
        return this.msgUnonload;
    }
});

// Adds an observer to the onInit event using the render method
    //var ed = new tinymce.Editor('someid', {
       
    //});

    //ed.onInit.add(function(ed) {
        //console.debug('Editor is doneXXXX: ' + ed.id);
   // });

    //ed.render();

function findHHandWW() { 
    var srcImageHS = top.ccdmd.nq4.imagePathHS;
    var imgLoadedProp = this.width / this.height;

    if (this.width > top.ccdmd.nq4.imgMaxWidth){
        var newWidth = top.ccdmd.nq4.imgMaxWidth;
        var newHeight = parseInt(newWidth / imgLoadedProp);

        var newInnerHTMLImg = "<a href=\"" + srcImageHS + "\" class=\"highslide\" onclick=\"return hs.expand(this)\">" + "<img id=\"imageOnPageId\" border=\"0\" src=\"" + srcImageHS + "\" style=\"width: " + newWidth + "px; height: " + newHeight + "px\">" + "</a>";
        $('imageContainer').innerHTML = newInnerHTMLImg;
    }
    else {
         $('imageContainer').innerHTML = "<a href=\"" + srcImageHS + "\" class=\"highslide\" onclick=\"return hs.expand(this)\">" + "<img id=\"imageOnPageId\" border=\"0\" src=\"" + srcImageHS + "\">" + "</a>";
    }

    $('imageContainer').show();

    return true;
}


function addHighSlideToOtherImages(section) {
    if (section == 'page') {
       // imagepart, choix de réponses.
       jQuery("#question #idStrChoices img").each(function() {
           if (jQuery(this).parent().attr("class") != "addedHS") {
               jQuery(this).wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery(this).attr('src') + '"></a>');
           }
       });
       
       // multiple answers, choix de réponses.
       jQuery(".questionChoice img").each(function() {
           if (jQuery(this).parent().attr("class") != "addedHS") {
               jQuery(this).wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery(this).attr('src') + '"></a>');
               jQuery(this).html("allo");
           }
       });
       
       // association, colonne de gauche,
       jQuery(".liAssLabel img").each(function() {
           if (jQuery(this).parent().attr("class") != "addedHS") {
               jQuery(this).wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery(this).attr('src') + '"></a>');
           }
       });
       
       // classement, image des contenants.
       jQuery(".tagImgStyle1 div img").each(function() {
           if (jQuery(this).parent().attr("class") != "addedHS") {
               jQuery(this).wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery(this).attr('src') + '"></a>');
           }
       });
       
       jQuery(".tagImgStyle2 div img").each(function() {
           if (jQuery(this).parent().attr("class") != "addedHS") {
               jQuery(this).wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery(this).attr('src') + '"></a>');
           }
       });
       
       
       // page de section, if leftovers...
       if (jQuery(this).parent().attr("class") != "highslide") {
          jQuery("#imageOnPageId").wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery('#imageOnPageId').attr('src') + '"></a>');
       }
    }         
    else if (section == 'feedback') {
         //association, feedback + solution.
         jQuery(".feedbackTable img").each(function() {
             if (jQuery(this).parent().attr("class") != "addedHS") {
                 jQuery(this).wrap('<a onclick="return hs.expand(this)" class="highslide addedHS" href="' + jQuery(this).attr('src') + '"></a>');
             }
         });
    }
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

function getNewNetquiz(){
    if (top.ccdmd == null) top.ccdmd = {};
    top.ccdmd.nq4 = new Netquiz();
    return top.ccdmd.nq4;
}

var labelLetters = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");

function getLetterLabel(i){
    var label = '';
    
    if(i < 27){
        label = labelLetters[i - 1];
    }else if((i % 26) == 0) {
        label = labelLetters[Math.floor(i  / 26) - 2] + labelLetters(26);
    }else{
        label = labelLetters[Math.floor(i  / 26) - 1] + labelLetters(i % 26);
    }
    
    return label;
}

function NQ4TimerFinish(){
    top.ccdmd.nq4.timerFinish();
}
function nq4_onImgsPreloadFinish(){
    top.ccdmd.nq4.begin();
}
function nq4_onConnectSuccess(transport){
    top.ccdmd.nq4.connectSuccess(transport);
}
function nq4_onAuthSuccess(transport){
    top.ccdmd.nq4.authSuccess(transport);
}
function nq4_auth(){
    top.ccdmd.nq4.auth();
}

function closeIndice(){
    indiceWindow.close();

    /*AVANT NETQUIZ TABLETTE, CHANGER DE PLAYER*/
    /*
    if (top.ccdmd.nq4.pages[top.ccdmd.nq4.currentPageIndex].videoPath)
        $('videoInPage').show();

    if (top.ccdmd.nq4.pages[top.ccdmd.nq4.currentPageIndex].soundPath)
        $('theSound').show();
    */
}

function closeFeedback(){
    feedbackWindow.close();

    /*AVANT NETQUIZ TABLETTE, CHANGER DE PLAYER*/
    /*
    if (top.ccdmd.nq4.pages[top.ccdmd.nq4.currentPageIndex].videoPath)
        $('videoInPage').show();

    if (top.ccdmd.nq4.pages[top.ccdmd.nq4.currentPageIndex].soundPath)
        $('theSound').show();
    */
}

function volumeControl(upOrDown,containerid){

     //PARAM VOLUME = 0-100, mais pour changer avec JS le volume, les values sont 0-255. Faire conversion avant...

     gTCALS.gSoundVolume = Math.round((gTCALS.gSoundVolume / 100) * 255);

     if (gTCALS.gSoundVolume > 255)
        gTCALS.gSoundVolume = 255;
     else if (gTCALS.gSoundVolume < 25)
        //NEVER MUTED
        gTCALS.gSoundVolume = 25;

     if (upOrDown == 1){
        if ((gTCALS.gSoundVolume + 35) <= 255)
           gTCALS.gSoundVolume = gTCALS.gSoundVolume + 35;
        else
           gTCALS.gSoundVolume = 255;
     }
     else{
        if ((gTCALS.gSoundVolume - 35) >= 35)
           gTCALS.gSoundVolume = gTCALS.gSoundVolume - 35;
        else
           //NEVER MUTED 
           gTCALS.gSoundVolume = 25;
     }

     containerid.SetVolume(gTCALS.gSoundVolume);

     gTCALS.gSoundVolume = Math.round((gTCALS.gSoundVolume / 255) * 100);
}

function nq4_buildHTMLElement(sTagName,aAtts){
    var oElement = null;

    try{
        var sElementHTML = '<' + sTagName;
        for(var sAtt in aAtts){
            if(aAtts[sAtt] || typeof aAtts[sAtt] != 'object'){
                sElementHTML += ' ' + sAtt + '=\"' + aAtts[sAtt] + '\"';
            }
        }
        sElementHTML += ">";
        
        oElement = document.createElement(sElementHTML);
    }catch(e){
        oElement = document.createElement(sTagName.toUpperCase());
        
        for(var sAtt in aAtts){
            if(aAtts[sAtt] || typeof aAtts[sAtt] != 'object'){
                oElement.setAttribute(sAtt,aAtts[sAtt]);
            }
        }
    }
    
    return oElement;
}
function nq4_buildImageObject(sFileName,iMaxWidth,iMaxHeight,sImgFolder){
    var iNewWidth = 0;
    var iNewHeight = 0;
    var sInnerHTML = "";

    var sImgSrc = sImgFolder + '/' + sFileName;
    var oImg = new Image();
    oImg.src = sImgSrc;

    if(iMaxWidth && oImg.width > iMaxWidth){
        iNewWidth = iMaxWidth;
        iNewHeight = nq4_b2(oImg.width,oImg.height,iMaxWidth);
    }else{
        iNewWidth = oImg.width;
        iNewHeight = oImg.height;
    }
    
    if(iMaxHeight && iNewHeight > iMaxHeight){
        iNewWidth = nq4_b2(iNewHeight,iNewWidth,iMaxHeight);
        iNewHeight = iMaxHeight;
    }
    
    iNewWidth = Math.round(iNewWidth);
    iNewHeight = Math.round(iNewHeight);
    
    return nq4_buildHTMLElement('img',{src:sImgSrc, width:iNewWidth, height:iNewHeight});
}

function nq4_b2(a1,a2,b1){
    return (a2 * b1) / a1;
}

function changeDecimalSymbol(number, symbol){
    var numberToReplace = number + '';
    numberToReplace = numberToReplace.replace(".",symbol);
    
    return numberToReplace;
}

function InitializeTimer()
{
    if(this.secs){
        if (gNQ4.currentPageIndex < gNQ4.numberPagesQuiz)
            gNQ4.pageTimer[gNQ4.currentPageIndex] = gNQ4.pageTimer[gNQ4.currentPageIndex] + this.secs;
    }

    this.secs = 0;
    StopTheClock();
    StartTheTimer();
}

function StopTheClock()
{
    if(this.timerRunning)
        clearTimeout(this.timerID);
    this.timerRunning = false;
}

function StartTheTimer()
{
    this.secs = this.secs + 1;
    this.timerRunning = true;
    this.timerID = self.setTimeout("StartTheTimer()", this.delay);
}

function nq4_entity_decode(str) {
  //Fonction du net. Doit avoir : var ta = document.createElement("textarea"); Si met dans
  //une variable ex : var newString = str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  //ne fonctionne pas...
  var ta = document.createElement("textarea");
  ta.innerHTML = str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  return ta.value;
}

function getElementPos(oElement)
{
    var oGeo = {x:0, y:0, height:0, width:0};
    
    oGeo.height = oElement.offsetHeight;
    oGeo.width = oElement.offsetWidth;
    if(oGeo.height == 0 && oGeo.width == 0 && typeof oElement.width != 'undefined')
    {
        oGeo.height = oElement.height;
        oGeo.width = oElement.width;
    }
    
    if (oElement.offsetParent)
    {
        while (oElement)
        {
            oGeo.x += oElement.offsetLeft;
            oGeo.y += oElement.offsetTop
            oElement = oElement.offsetParent;
        }
    }
    else if (oElement.x)
    {
        oGeo.x += oElement.x;
        oGeo.y += oElement.y;
    }
    
    return oGeo;
}

function tcals_createElement(nodeName, name){
    var node;
    
    try {
        node = document.createElement("<"+nodeName+" name="+name+">");
    } catch (e) {
        node = document.createElement(nodeName);
        node.name = name;
    }
    
    return node;
}
function nq4_navbartext_onkeypress(e){
    var unicode = e.keyCode? e.keyCode : e.charCode;

    if (unicode == '13'){
        var pageIndex = $F('navBarTxtPageIndex') - 1;
        top.ccdmd.nq4.pageGoto(pageIndex);
    }
}

function tcals_onunload(){
    return top.ccdmd.nq4.onunload();
}
//FONCTIONS DE NETQUIZ3
function getShuffledOrder(N) {
    var J, K, Q = new Array(N);
    for (J = 0; J < N; J++) {
        K = nq4_random(J + 1);
        Q[J] = Q[K];
        Q[K] = J;
    }
    return Q;
}
function nq4_random(N) {
    return Math.floor(N * (Math.random() % 1));
}
function cleanForValid(s){
    var toReturn = s;
    
    toReturn = toReturn.replace(/^\s*|\s*$/g,"");
    toReturn = toReturn.replace(/  */g,' ');
    toReturn = toReturn.replace(/<br \/>/g,'');
    toReturn = toReturn.replace(/<br>*/g,'');
    toReturn = toReturn.replace(/\n*/g,'');
    
    return toReturn;
}

var car = new Array(50);
var car0 = new Array(50);

car0 [1] = "%26agrave%3B";
car0 [2] = "%26aacute%3B";
car0 [3] = "%26acirc%3B";
car0 [4] = "%26auml%3B";
car0 [5] = "%26ccedil%3B";
car0 [6] = "%26egrave%3B";
car0 [7] = "%26eacute%3B";
car0 [8] = "%26ecirc%3B";
car0 [9] = "%26euml%3B";
car0 [10] = "%26igrave%3B";
car0 [11] = "%26iacute%3B";
car0 [12] = "%26icirc%3B";
car0 [13] = "%26iuml%3B";
car0 [14] = "%26ntilde%3B";
car0 [15] = "%26ograve%3B";
car0 [16] = "%26oacute%3B";
car0 [17] = "%26ocirc%3B";
car0 [18] = "%26ouml%3B";
car0 [19] = "%26ugrave%3B";
car0 [20] = "%26uacute%3B";
car0 [21] = "%26ucirc%3B";
car0 [22] = "%26uuml%3B";
car0 [23] = "%26Agrave%3B";
car0 [24] = "%26Aacute%3B";
car0 [25] = "%26Acirc%3B";
car0 [26] = "%26Auml%3B";
car0 [27] = "%26Ccedil%3B";
car0 [28] = "%26Egrave%3B";
car0 [29] = "%26Eacute%3B";
car0 [30] = "%26Ecirc%3B";
car0 [31] = "%26Euml%3B";
car0 [32] = "%26Igrave%3B";
car0 [33] = "%26Iacute%3B";
car0 [34] = "%26Icirc%3B";
car0 [35] = "%26Iuml%3B";
car0 [36] = "%26Ntilde%3B";
car0 [37] = "%26Ograve%3B";
car0 [38] = "%26Oacute%3B";
car0 [39] = "%26Ocirc%3B";
car0 [40] = "%26Ouml%3B";
car0 [41] = "%26Ugrave%3B";
car0 [42] = "%26Uacute%3B";
car0 [43] = "%26Ucirc%3B";
car0 [44] = "%26Uuml%3B";
car0 [45] = "%26szlig%3B";
car0 [46] = "%26#171%3B";
car0 [47] = "%26#187%3B";
car0 [48] = "%26quot%3B";
  
function convertir(chaine) {
    var caraca = "";
    var caracb = "";
    for (var i = 1; i < 49; i++)  {
        caraca = car0[i];
        if (chaine.indexOf(caraca) >= 0) {
            caracb = car[i];
            chaine = caractere(chaine, caraca, caracb);
        }
    }
    return(chaine);
}

function caractere(chaine, caraca, caracb) {
    var y = -1;
    var n = chaine.length;
    var chaineNew = chaine;
    var longueur = caraca.length;
    
    while (chaine.indexOf(caraca) >= 0) {
        y = chaine.indexOf(caraca);
        if (y > 0) {
            chaineNew = chaine.substring(0,y) + caracb + chaine.substring(y+longueur, n);
            n = chaineNew.length;
            chaine = chaineNew;
        } else if (y == 0) {
            chaineNew = caracb + chaine.substring(y+longueur, n);
            n = chaineNew.length;
            chaine = chaineNew;
        }
    }
    return(chaine);
}
function trim(s) {
  while (s.substring(0,1) == ' ') {
    s = s.substring(1,s.length);
  }
  while (s.substring(s.length-1,s.length) == ' ') {
    s = s.substring(0,s.length-1);
  }
  return s;
}
function makeArray1(n) {
  this.length = n;
  for (var i = 0; i < n; i++) this[i] = false;
  return this;
}
function makeArray2(n) {
  this.length = n;
  for (var i = 0; i < n; i++) this[i] = "";
  return this;
}
function makeArray3(n) {
  this.length = n;
  for (var i = 0; i < n; i++) this[i] = 0;
  return this;
}
function makeArray4(n) {
  this.length = n;
  for (var i = 0; i < n; i++) this[i] = " ";
  return this;
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

function rgb2hex(rgb){
         rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
         return "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

function hexToRgb(hex) { 
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); 
    return result ? { 
        r: parseInt(result[1], 16), 
        g: parseInt(result[2], 16), 
        b: parseInt(result[3], 16) 
    } : null; 
} 