var QuestionCheckerBoard = Class.create({
    TEXTE_TEXTE: 0,
    TEXTE_IMAGE: 1,
    IMAGE_TEXTE: 2,
    IMAGE_IMAGE: 3,
    
    NONE: 0,
    LETTERS: 1,
    NUMBERS: 2,
    
    //AUTRES VARIABLE (MIS EN COMMENTAIRES, DOIVENT ALLER DANS initialize()
    //sChoixA: new Array(),
    //sChoixB: new Array(),
    //bFound: new Array(),
    //iChoixOrder: new Array(),
    //sLogo: new Array(),
    iType: 0,
    iAffichage: 0,
    sBkgA: "FFFFFF",
    sBkgB: "FFFFFF",
    feedback: "",
    checkerBoard: null,
    
    //VARIABLE COMMUNE
    ponderation: 1,
    sDecDelimiter: ",",
    iLabelType: 0,
    currentScore: 0,
    status: 0,
    triesCount: 0,
    questionNb: 0,
    
     //Mandatory functions
    initialize: function(quiz, page, questionNb){
        this.quiz = quiz;
        this.page = page;
        this.questionNb = questionNb;
        this.checkerBoard = getNewCheckerBoard();
        this.checkerBoard.owner = this;

        //REGLE BOGUE DOUBLONS SOLUTION
        this.sChoixA = new Array();
        this.sChoixB = new Array();
        this.bFound = new Array();
        this.iChoixOrder = new Array();
        this.sLogo = new Array();

        this.status = this.quiz.statusToDo;
        this.checkerBoard.onPairFound = this.setBrotherhoodFound;
    },
    
    save: function(){

    },
    
    display: function(){
        this.checkerBoard.display($('question'));
    },
    
    validate: function(){
        var feedbackHTML = "";
        var currentScore = 0;
        var goodAnswerCount = 0;
        
        this.triesCount++;
        
        for(var i = 0;i < this.bFound.length;i++){
            if(this.bFound[i]){
                goodAnswerCount++;
            }
        }
        
        this.currentScore = (goodAnswerCount / this.bFound.length) * this.ponderation;
        
        this.status = this.quiz.statusToRedo;
        if (goodAnswerCount == this.bFound.length){
            if(this.currentScore == this.ponderation){
                feedbackHTML = '<span class="Green">' + this.quiz.goodAnswerLabel + '</span><br /><br />';
                feedbackHTML += '<br /><span class="small">' + this.feedback + '</span></td>';
                this.status = this.quiz.statusCompleted;
            }
        }else{
            feedbackHTML = '<span class="Yellow">' + this.quiz.incompleteAnswerLabel + '</span><br /><br />';
        }
        
        setFeedback(feedbackHTML);
        openFeedback();
        return currentScore;
    },
    
    showSolution: function(){
        var feedbackHTML = "";
        var sEti = "";
        var iNbCol = 3;
        
        //feedbackHTML = "<h1 class=\"RetroSolution\">" + this.quiz.solutionLabel + "</h1><br />";
        feedbackHTML =  this.quiz.solutionLabel + "<br /><br />";
        feedbackHTML += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>\n";

        for(var i = 0;i < this.sChoixA.length;i++){
            /*Afficher la solution*/

            //Choix
            if(this.iType == this.TEXTE_TEXTE || this.iType == this.TEXTE_IMAGE){
                feedbackHTML += "<td valign=\"top\">" + this.sChoixA[i] + "<img src=\"images/base/spacer.gif\" width=\"25\" height=\"10\"></td>";
            }else{
                feedbackHTML += "<td valign=\"top\">";
                var temp = new Element('div');
                temp.appendChild(nq4_buildImageObject(this.sChoixA[i],110,145,this.quiz.mediasFolder));    //115,115
                feedbackHTML += temp.innerHTML;
                
                feedbackHTML += "<img src=\"images/base/spacer.gif\" width=\"25\" height=\"10\"></td>";
            }

            //Choix
            if(this.iType == this.TEXTE_TEXTE || this.iType == this.IMAGE_TEXTE){
                feedbackHTML += "<td valign=\"top\">" + this.sChoixB[i] + "<img src=\"images/base/spacer.gif\" width=\"25\" height=\"10\"></td>";
            }else{
                feedbackHTML += "<td valign=\"top\">";
                var temp = new Element('div');
                temp.appendChild(nq4_buildImageObject(this.sChoixB[i],110,145,this.quiz.mediasFolder));
                feedbackHTML += temp.innerHTML;
                
                feedbackHTML += "<img src=\"images/base/spacer.gif\" width=\"25\" height=\"10\"></td>";
            }
            
            feedbackHTML += "</tr>\n";
            feedbackHTML += "<tr><td class=\"feedbackLineSpacer\">&nbsp;</td></tr>\n";
        }
        
        feedbackHTML += "</table>\n";
        
        setFeedback(feedbackHTML);
        openFeedback();
    },
    
    //redo: function(bSilent){
    redo: function(){
        for(var i = 0;i < this.bFound.length;i++){
            this.bFound[i] = false;
        }
        
        this.checkerBoard.redo();
        
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;

        closeFeedback();
        $('question').update();
        this.display();
    },

    redoQuiz: function(){
        for(var i = 0;i < this.bFound.length;i++){
            this.bFound[i] = false;
        }
        
        this.checkerBoard.redo();
        
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;

        closeFeedback();
        $('question').update();
        this.display();
    },
    
    //FONCTION SPECIFIQUE
    addChoice: function(sCA,sCB,sLogo){

        var iLastIndex = this.sChoixA.length;
        
        this.sChoixA[iLastIndex] = sCA;
        this.sChoixB[iLastIndex] = sCB;
        this.sLogo[iLastIndex] = sLogo;
        this.bFound[iLastIndex] = false;
        
        var aType = ((this.iType == this.TEXTE_TEXTE || this.iType == this.TEXTE_IMAGE ) ? this.checkerBoard.TEXT : this.checkerBoard.IMAGE);
        var bType = ((this.iType == this.TEXTE_TEXTE || this.iType == this.IMAGE_TEXTE ) ? this.checkerBoard.TEXT : this.checkerBoard.IMAGE);

        if (aType == 1){
            this.quiz.imgPreloader.addImage(sCA);
        }

        if (bType == 1){
            this.quiz.imgPreloader.addImage(sCB);
        }

        this.checkerBoard.addPair(sCA,aType,sCB,bType,iLastIndex,sLogo);
        
        this.quiz.imgPreloader.addImage(sLogo);
    },
    
    setBrotherhoodFound: function(i){
        this.bFound[i] = true;
    },
    
    setAffichage: function(i){
        this.iAffichage = i;
        
        this.checkerBoard.iDisplayType = (i == 0 ? this.checkerBoard.VISIBLE : this.checkerBoard.HIDDEN);//0 = NON-MASQUE
    },
    
    setType: function(i){
        this.iType = i;
    },
    
    setFeedback: function(s){
        this.feedback = s;
    },
    
    setBkgA: function(s){
        this.sBkgA = s;
        this.checkerBoard.sCell1BkgColor = '#' + s;
    },
    
    setBkgB: function(s){
        this.sBkgB = s;
        this.checkerBoard.sCell2BkgColor = '#' + s;
    },
    
    shuffle: function(){
        this.iChoixOrder = getShuffledOrder(this.sChoixA.length * 2);
    },
    getConsigne: function(){
        return this.quiz.consigneCheckerBoard;
    }
});