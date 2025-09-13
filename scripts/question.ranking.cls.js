var QuestionRanking = Class.create({
    sQuestionType: 'RANKING',
    TEXT: 0,
    IMAGE: 1,

    NONE: 0,
    LETTERS: 1,
    NUMBERS: 2,
    
    //System settings
    sListIdPrefix: 'ranking',
    sIdDelimiter: '_',
    sLabelSuffix: ')&nbsp;&nbsp;',
    iListHeightAdjust: -17, //17,//10
    iListItemPadding: 10, //10,//5
    
    
    //User settings
    iChoiceWidth: 110,
    iChoiceMaxHeight: 145,
    labelType: 0,
    
    //Variables
    //sChoices: new Array(),
    //iChoicesPos: new Array(),
    //choicesInitPos: new Array(),
    //sGoodAnswerFeedback: new Array(),
    //sWrongAnswerFeedback: new Array(),
    questionNb: 0,
    oList: null,
    someSortableId: '',
    widthSortableFeedback: 0,
    tableWidthSortableFeedback: 0,
    tableHeightSortableFeedback: 0,
    
    currentScore: 0,
    ponderation: 0,
    triesCount: 0,
    status:'',
    
    //Mandatory functions
    initialize: function(quiz, page, questionNb){
        this.quiz = quiz;
        this.page = page;
        this.questionNb = questionNb;

        this.sChoices = new Array();
        this.iChoicesPos = new Array();
        this.choicesInitPos = new Array();
        this.sGoodAnswerFeedback = new Array();
        this.sWrongAnswerFeedback = new Array();
        
        this.status = this.quiz.statusToDo;
    },
    
    display: function(){
        //Lists
        var oListsWrapper = nq4_buildHTMLElement('table',{cellpadding:'0',cellspacing:'0',border:'0'});
        //oListsWrapper.width = (this.iChoiceWidth * 2);
        var oCurrRow = oListsWrapper.insertRow(0);
        var oLabelsWrapper = oCurrRow.insertCell(0);
        var oChoicesWrapper = oCurrRow.insertCell(1);
        
        oLabelsWrapper.vAlign = "top";

        this.oList = this.buildRankingSortable();
        this.oList.id = this.sListIdPrefix + this.sIdDelimiter + this.questionNb
        oChoicesWrapper.appendChild(this.oList);
        
        if(this.labelType != this.NONE){
            var oLabelsList = this.buildRankingLabels();
            oLabelsList.id = this.sListIdPrefix  + this.sIdDelimiter + 'labels' + this.sIdDelimiter + this.questionNb
            oLabelsWrapper.appendChild(oLabelsList);
        }
        $('question').update(oListsWrapper);

        Position.includeScrollOffsets = true;
        Sortable.create(this.oList.id, {scroll:window});
        
        if(this.labelType != this.NONE){
            this.balanceLists(this.oList,oLabelsList);
        }
    },
    
    save: function(){
        this.sSaveValue = '';
        var iIndex = null;
        var sId = null;
        var iPos = 0;
        
        for(var i = 0;i < this.oList.childNodes.length;i++){
            if(this.oList.childNodes[i].tagName == 'LI'){
                sId = this.oList.childNodes[i].id;
                iIndex = sId.substring(sId.lastIndexOf(this.sIdDelimiter) + 1);
                this.iChoicesPos[iIndex] = iPos;
                
                iPos++;
            }
        }
    },
    validate: function(){
        this.save();
        this.triesCount++;
        var feedbackHTML = '';
        var goodAnswerCount = 0;
        var wrongAnswerCount = 0;
        var heightToPut;
        var widthToPut;
        
        var label = '';
        var choice = '';
        var bulletImage = '';
        var feedback = '';
        for(var i = 0;i < this.sChoices.length; i++){
            var theCols = '<td width="20">&nbsp;</td>';

            switch(this.labelType){
                case this.LETTERS:
                    label = getLetterLabel(i + 1).toUpperCase() + this.sLabelSuffix;
                    break;
                case this.NUMBERS:
                    label = (i + 1) + this.sLabelSuffix;
                    break;
            }
            
            currentChoiceId = this.iChoicesPos.indexOf(i);
            choice = this.sChoices[currentChoiceId];
            
            if(this.iChoicesPos[i] == i){
                goodAnswerCount++;
                bulletImage = 'bullet_green.jpg';
                feedback = this.sGoodAnswerFeedback[currentChoiceId];
            }else{
                wrongAnswerCount++;
                bulletImage = 'bullet_red.jpg';
                feedback = this.sWrongAnswerFeedback[currentChoiceId]
            }
            

            heightToPut = document.getElementById(this.someSortableId).style.height;

            feedbackHTML += '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="feedbackTable">';
            feedbackHTML += '<tr>';
            feedbackHTML += '<td width="20" style="padding-top: 8px;"><img src="images/base/' + bulletImage + '" /></td>';
            if (this.labelType > 0){
                feedbackHTML += '<td width="25"><ul style="list-style-type: none; margin-top: -3px; padding: 0pt; margin-left: 0pt; margin-bottom: 0px;"><li style="margin-bottom: 0px; padding-top: 10px; padding-bottom: 10px; padding-right: 6px; height:' + heightToPut + ';">' + label + '</li></ul></td>';
                theCols = theCols + '<td width="25">&nbsp;</td>';
            }

            if(choice[1] == this.TEXT){
                feedbackHTML += '<td height="' + heightToPut + '"><ul style="list-style-type:none; padding:0pt; margin-left:0pt; margin-top:-3px; margin-bottom: 0px;"><li style="border:1px solid #CBC8C8; padding:10px; width:' + this.widthSortableFeedback + '; height:' + heightToPut + ';">' + choice[0] + '</li></ul></td>';
                feedbackHTML += '<tr>' + theCols + '<td class="feedbackLineTxt"><span class="small">' + feedback + '</span></td>';

            }else{
                var temp = new Element('div');
                temp.appendChild(nq4_buildImageObject(choice[0],this.iChoiceWidth,this.iChoiceMaxHeight,this.quiz.mediasFolder));
                heightToPut = "100%";

                feedbackHTML  += '<td height="' + heightToPut + '"><ul style="list-style-type:none; padding:0pt; margin-left:0pt; margin-top:-3px; margin-bottom: 0px;"><li style="border:1px solid #CBC8C8; padding:10px; position:relative; width:' + this.widthSortableFeedback + '; height:' + heightToPut + ';"><table class="feedbackTable2" cellspacing="0" cellpadding="0" border="0"><tr><td width="' + this.tableWidthSortableFeedback + '" height="' + this.tableHeightSortableFeedback + '" align="center" valign="middle">' + temp.innerHTML + '</td></tr></table></li></ul></td>';
                feedbackHTML += '<tr>' + theCols + '<td class="feedbackLineImg"><span class="small">' + feedback + '</span></td>';
            }
            
            feedbackHTML += '</tr>';

            if (feedback != ''){
                feedbackHTML += '<tr>' + theCols + '<td class="feedbackLineSpacer">&nbsp;</td></tr>';
            }
            feedbackHTML += '</table>';
        }
        
        this.currentScore = goodAnswerCount / this.sChoices.length * this.ponderation;
        
        this.status = this.quiz.statusToRedo;
        if(this.currentScore == this.ponderation){
            feedbackHTML = '<span class="Green">' + this.quiz.goodAnswerLabel + '</span><br /><br />' + feedbackHTML;
            this.status = this.quiz.statusCompleted;
        }else{
            if(wrongAnswerCount > 0)
                feedbackHTML = '<span class="Red">' + this.quiz.wrongAnswerLabel + '</span><br /><br />' + feedbackHTML;
            else
                feedbackHTML = '<span class="Yellow">' + this.quiz.incompleteAnswerLabel + '</span><br /><br />' + feedbackHTML;
        }
        
        setFeedback(feedbackHTML);
        openFeedback();
        
        return this.currentScore;
    },
    showSolution: function(){
        var label = '';
        var solutionHTML =  this.quiz.solutionLabel + '<br /><br />';
        var heightToPut;
        for(var i = 0;i < this.sChoices.length;i++){
            switch(this.labelType){
                case this.LETTERS:
                    label = getLetterLabel(i + 1).toUpperCase() + this.sLabelSuffix;
                    break;
                case this.NUMBERS:
                    label = (i + 1) + this.sLabelSuffix;
                    break;
            }
            
            choice = this.sChoices[i];

            heightToPut = document.getElementById(this.someSortableId).style.height;

            solutionHTML += '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="feedbackTable">';
            solutionHTML += '<tr>';
            if (this.labelType > 0)
                solutionHTML += '<td width="25"><ul style="list-style-type: none; margin-top: -3px; padding: 0pt; margin-left: 0pt;"><li style="margin-bottom: 20px; padding-top: 10px; padding-bottom: 10px; padding-right: 6px; height:' + heightToPut + ';">' + label + '</li></ul></td>';
            
            if(choice[1] == this.TEXT){
                solutionHTML += '<td height="' + heightToPut + '"><ul style="list-style-type:none; padding:0pt; margin-left:0pt; margin-top:-3px; margin-bottom:0px;"><li style="border:1px solid #CBC8C8; padding:10px; width:' + this.widthSortableFeedback + '; height:' + heightToPut + ';">' + choice[0] + '</li></ul></td>';
            }else{
                var temp = new Element('div');
                temp.appendChild(nq4_buildImageObject(choice[0],this.iChoiceWidth,this.iChoiceMaxHeight,this.quiz.mediasFolder));
                solutionHTML += '<td height="' + heightToPut + '"><ul style="list-style-type:none; padding:0pt; margin-left:0pt; margin-top:-3px; margin-bottom:0px;"><li style="border:1px solid #CBC8C8; padding:10px; position:relative; width:' + this.widthSortableFeedback + '; height:' + heightToPut + ';"><table class="feedbackTable2" cellspacing="0" cellpadding="0" border="0"><tr><td width="' + this.tableWidthSortableFeedback + '" height="' + this.tableHeightSortableFeedback + '" align="center" valign="middle">' + temp.innerHTML + '</td></tr></table></li></ul></td>';
            }
            
            solutionHTML += '</tr>';
            solutionHTML += '</table>';
        }
        setFeedback(solutionHTML);
        openFeedback();
    },
    redo:function(whereFrom){
        this.iChoicesPos = this.choicesInitPos.clone();
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;

        closeFeedback();
        this.display();
    },
    redoQuiz: function(){
        this.iChoicesPos = this.choicesInitPos.clone();
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;
    },
    isAnswered: function() {
        return true;
    },
    
    setLabelType: function(i){
        this.labelType = i;
    },
    //Question specific functions
    addChoice: function(sChoice,iChoiceType,sGoodAnswerFeedback,sWrongAnswerFeedback,position){
        if (position == 0){
            this.sChoices[this.sChoices.length] = [sChoice, iChoiceType];
            if(iChoiceType == this.IMAGE){
                this.quiz.imgPreloader.addImage(sChoice);
            }
            this.iChoicesPos[this.iChoicesPos.length] = this.iChoicesPos.length;
            this.choicesInitPos[this.choicesInitPos.length] = this.choicesInitPos.length;
            this.sGoodAnswerFeedback[this.sGoodAnswerFeedback.length] = sGoodAnswerFeedback;
            this.sWrongAnswerFeedback[this.sWrongAnswerFeedback.length] = sWrongAnswerFeedback;
        }
        else{
            position = position - 1;

            this.sChoices[this.sChoices.length] = [sChoice, iChoiceType];
            if(iChoiceType == this.IMAGE){
                this.quiz.imgPreloader.addImage(sChoice);
            }
            this.iChoicesPos[this.iChoicesPos.length] = position;
            this.choicesInitPos[this.choicesInitPos.length] = position;
            this.sGoodAnswerFeedback[this.sGoodAnswerFeedback.length] = sGoodAnswerFeedback;
            this.sWrongAnswerFeedback[this.sWrongAnswerFeedback.length] = sWrongAnswerFeedback;
        }
    },
    setChoicePos: function(iID,iPos){
        this.iChoicesPos[iID] = iPos;
    },
    buildRankingSortable: function(){
        var oListItem = null;
        var iCurrIndex = null;
        var oList = nq4_buildHTMLElement('ul',{});
        oList.style.listStyleType = 'none';
        oList.style.padding = '0';
        oList.style.marginLeft = '0';
        oList.style.marginTop = '-3px'; //MONTE DE 10px POUR ALIGNEMENT LUCIE.
        
        for(var i = 0;i < this.sChoices.length;i++){
            oListItem = nq4_buildHTMLElement('li',{});
            
            oListItem.style.marginBottom = '15px'; //20px
            oListItem.style.border = 'solid 1px #CBC8C8';
            oListItem.style.padding = this.iListItemPadding + 'px';
            oListItem.style.cursor = 'move';
            
            for(var j = 0;j < this.iChoicesPos.length;j++){
                if(this.iChoicesPos[j] == i){
                    iCurrIndex = j;
                    break;
                }
            }
           
            if(this.sChoices[iCurrIndex][1] == this.TEXT){
                oListItem.innerHTML = this.sChoices[iCurrIndex][0];
            }else{
                var oContentLI = nq4_buildHTMLElement('table',{cellpadding:'0',cellspacing:'0',border:'0'});
                var oCurrRowLI = oContentLI.insertRow(0);
                var oCellLI = oCurrRowLI.insertCell(0);

                oCellLI.id = "tdLI" + i;

                oListItem.appendChild(oContentLI);
                oCellLI.appendChild(nq4_buildImageObject(this.sChoices[iCurrIndex][0],this.iChoiceWidth,this.iChoiceMaxHeight,this.quiz.mediasFolder));
            }
            
            oListItem.id = this.sListIdPrefix + this.sIdDelimiter + this.questionNb + this.sIdDelimiter + iCurrIndex;
            this.someSortableId = this.sListIdPrefix + this.sIdDelimiter + this.questionNb + this.sIdDelimiter + iCurrIndex;
            oList.appendChild(oListItem);
        }
        
        return oList;
    },
    
    buildRankingLabels: function(){
        var sLabel = '';
        var oListItem = null;
        var iCurrIndex = null;
        var oList = nq4_buildHTMLElement('ul',{});
        oList.style.listStyleType = 'none';
        oList.style.padding = '0';
        oList.style.marginLeft = '0';
        oList.style.marginTop = '-3px'; //MONTE DE 10px POUR ALIGNEMENT LUCIE.
        
        for(var i = 0;i < this.sChoices.length;i++){
            oListItem = nq4_buildHTMLElement('li',{});
            
            oListItem.style.marginBottom = '15px';
            oListItem.style.paddingTop = this.iListItemPadding + 'px';

            /*if(this.sChoices[i][1] == this.IMAGE){
                alert("ici");

                if (i == 0){
                    oListItem.style.paddingTop = '0px';
                }
                else{
                    oListItem.style.paddingTop = '10px';
                }
            }
            else{
                oListItem.style.paddingTop = '10px';
            }*/

            oListItem.style.paddingBottom = this.iListItemPadding + 'px';
            oListItem.style.paddingRight = '6px';
            
            if(this.labelType == this.LETTERS){
                sLabel = getLetterLabel(i + 1).toUpperCase() + this.sLabelSuffix;
            }else if(this.labelType == this.NUMBERS){
                sLabel = (i + 1) + this.sLabelSuffix;
            }
            oListItem.innerHTML = sLabel;
            
            oList.appendChild(oListItem);
        }
        
        return oList;
    },
    balanceLists: function(oListA,oListB){
        var iMaxWidth = 0;
        var iMaxHeight = 0;
        
        for(var i = 0;i < oListA.childNodes.length;i++){
            if(oListA.childNodes[i].tagName == 'LI'){
                iMaxHeight = Math.max(iMaxHeight,getElementPos(oListA.childNodes[i]).height);
                iMaxWidth = Math.max(iMaxWidth,getElementPos(oListA.childNodes[i]).width);
            }
        }
        
        for(var i = 0;i < oListB.childNodes.length;i++){
            if(oListB.childNodes[i].tagName == 'LI'){
                iMaxHeight = Math.max(iMaxHeight,getElementPos(oListB.childNodes[i]).height);
            }
        }
        
        iMaxHeight += this.iListHeightAdjust;
        iMaxWidth = iMaxWidth - (this.iListItemPadding * 2) - 2;

        for(var i = 0;i < oListA.childNodes.length;i++){
            if(oListA.childNodes[i].tagName == 'LI'){
                oListA.childNodes[i].style.height = iMaxHeight + 'px';
            }
        }
        
        for(var i = 0;i < oListB.childNodes.length;i++){
            if(oListB.childNodes[i].tagName == 'LI'){
                oListB.childNodes[i].style.height = (iMaxHeight + 2) + 'px';
            }
        }

        for(var i = 0;i < oListA.childNodes.length;i++){
            if(oListA.childNodes[i].tagName == 'LI'){
                var iCurrIndex;

                for(var j = 0;j < this.iChoicesPos.length;j++){
                    if(this.iChoicesPos[j] == i){
                        iCurrIndex = j;
                        break;
                    }
                }

                this.widthSortableFeedback = iMaxWidth + 'px';

                if(this.sChoices[iCurrIndex][1] == this.IMAGE){
                    var theID = "tdLI" + i;
                    $(theID).width = iMaxWidth + 'px';
                    $(theID).height = iMaxHeight + 'px';

                    this.tableWidthSortableFeedback = iMaxWidth + 'px';
                    this.tableHeightSortableFeedback = iMaxHeight + 'px';

                    document.getElementById(theID).align = 'center';
                    document.getElementById(theID).vAlign = 'middle';
                }
            }
        }
    },
    
    shuffle: function(){
        this.iChoicesPos = getShuffledOrder(this.sChoices.length);
        this.choicesInitPos = this.iChoicesPos.clone();
    },
    getConsigne: function(){
        return this.quiz.consigneRanking;
    }
});