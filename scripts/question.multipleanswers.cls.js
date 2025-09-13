var QuestionMultipleAnswers = Class.create({
    NONE: 0,
    ALPHA: 1,
    NUMERIC: 2,
    
    //settings
    labelType: 0,
    mustGiveAllGoodAnswers: true,
    
    choices: null,
    feedbacks: null,
    goodAnswers: null,
    inputs: null,
    currentChoices: null,
    iChoiceWidth: 100, //200
    iChoiceMaxHeight: 150,  //250
    currentScore: 0,
    ponderation: 0,
    triesCount: 0,
    status:'',
    
    initialize: function(quiz, page, questionNb){
        this.quiz = quiz;
        this.page = page;
        this.questionNb = questionNb;
        
        this.choices = new Array();
        this.displayChoices = new Array();
        this.choicesType = new Array();
        this.inputs = new Array();
        this.feedbacks = new Array();
        this.goodAnswers = new Array();
        
        this.status = this.quiz.statusToDo;
    },
    
    addChoice: function(choice, iChoiceType, feedback, isGoodAnswer){
        var theLength = this.choices.length;

        if (iChoiceType == 1)
            this.quiz.imgPreloader.addImage(choice);

        this.choices[this.choices.length] = choice;
        this.choicesType[this.choicesType.length] = iChoiceType;
        this.displayChoices[theLength] = this.choices.length - 1;
        this.feedbacks[this.feedbacks.length] = feedback;
        if(isGoodAnswer)
            this.goodAnswers[this.goodAnswers.length] = this.choices.length - 1;
    },

    shuffle: function(){
        this.shuffleChoices(this.displayChoices);
    },
    
    display : function(){
        var divLabel = null;
        var divText = null;
        var divInput = null;
        var divChoice = null;
        var form = null;

       // var oTable = null;
        var iColIndex = null;
        var oCurrRow = null;
        var oCurrCell = null;

        var iRowHeight = 22;
        var iTextCellPaddingLeft = 10;
        var iChoiceRowPaddingTop = 15;

        form = document.createElement('form');
        

        oTable = document.createElement('table');
        oTable.width = '100%';
        
        for(i = 0;i < this.choices.length;i++){
            //label

            iColIndex = 0;
            oCurrRow = oTable.insertRow(i);
            oCurrCell = oCurrRow.insertCell(iColIndex);

            oCurrCell.height = iRowHeight;
            if (i > 0)
                oCurrCell.style.paddingTop = iChoiceRowPaddingTop + 'px';

            oCurrCell.align = 'left';
            oCurrCell.vAlign = 'top';

            if (this.labelType > 0){
                if(this.labelType == this.ALPHA)
                    oCurrCell.innerHTML = getLetterLabel(i + 1).toUpperCase() + ')';
                else if(this.labelType == this.NUMERIC)
                    oCurrCell.innerHTML = (i + 1) + ')';

                iColIndex++;

                oCurrCell.style.paddingRight = '13px';
                oCurrCell = oCurrRow.insertCell(iColIndex);
            }

            this.inputs[i] = tcals_createElement('input','rdoQuestion');
            this.inputs[i].type = 'checkbox';
            if(this.currentChoices && this.currentChoices.indexOf(i) > -1)
                this.inputs[i].checked = 'checked';
                
            oCurrCell.appendChild(this.inputs[i]);

            oCurrCell.height = iRowHeight;
            if (i > 0)
                oCurrCell.style.paddingTop = iChoiceRowPaddingTop + 'px';

            oCurrCell.align = 'left';
            oCurrCell.vAlign = 'top';
            oCurrCell.style.paddingBottom = '3px';
            oCurrCell.style.paddingRight = '5px';
            //oCurrCell.style.paddingLeft = '8px';

            iColIndex++;

            oCurrCell = oCurrRow.insertCell(iColIndex);

            oCurrCell.width = '100%';
            oCurrCell.height = iRowHeight;
            if (i > 0)
                oCurrCell.style.paddingTop = iChoiceRowPaddingTop + 'px';

            oCurrCell.style.paddingLeft = '2px';
            oCurrCell.align = 'left';
            oCurrCell.vAlign = 'top';

            if (this.choicesType[this.displayChoices[i]] == 1){
                var imgChoice = nq4_buildImageObject(this.choices[this.displayChoices[i]],this.iChoiceWidth,this.iChoiceMaxHeight,this.quiz.mediasFolder)
                oCurrCell.appendChild(imgChoice);
            }
            else{
                oCurrCell.innerHTML = this.choices[this.displayChoices[i]];
            }
        }

        //main
        divChoice = document.createElement('div');
        divChoice.className = 'questionChoice';
        divChoice.appendChild(oTable);
            
        form.appendChild(divChoice);
        
        $('question').update(form);
    },

    save: function(){
        this.currentChoices = new Array();
    
        for(i = 0;i < this.inputs.length;i++){
            if (this.inputs[i].checked){
                this.currentChoices[this.currentChoices.length] = i;
            }
        }
        
        return this.currentChoices.join(',');
    },
    
    validate: function(){
        this.save();
        this.triesCount++;
        var feedbackHTML = '';
        var goodAnswerCount = 0;
        var wrongAnswerCount = 0;
        
        for(var i = 0;i < this.currentChoices.length;i++){

           var bulletImage = 'bullet_red.jpg';
           var theCols = '<td width="20">&nbsp;</td>';
            
           if(this.goodAnswers.indexOf(this.displayChoices[this.currentChoices[i]]) > -1){
                goodAnswerCount++;
                bulletImage = 'bullet_green.jpg';
            }else{
                wrongAnswerCount++;
            }

            var label = '';
            if(this.labelType == this.ALPHA){
                label = getLetterLabel(this.currentChoices[i] + 1).toUpperCase() + ')';
            }
            else if(this.labelType == this.NUMERIC){
                label = (this.currentChoices[i] + 1) + ')';
            }

            var choice = this.choices[this.displayChoices[this.currentChoices[i]]];
            var choiceType = this.choicesType[this.displayChoices[this.currentChoices[i]]];
            
            feedbackHTML += '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="feedbackTable">';
            feedbackHTML += '<tr>';
            feedbackHTML += '<td width="20"><img src="images/base/' + bulletImage + '" /></td>';
            if (this.labelType > 0){
                feedbackHTML += '<td width="25">' + label + '</td>';
                theCols = theCols + '<td width="25">&nbsp;</td>';
            }

            if (choiceType == 1){
                var temp = new Element('div');
                temp.appendChild(nq4_buildImageObject(this.choices[this.displayChoices[this.currentChoices[i]]],this.iChoiceWidth,this.iChoiceMaxHeight,this.quiz.mediasFolder));
                feedbackHTML += '<td>' + temp.innerHTML + '</td></tr>';

                if (this.feedbacks[this.displayChoices[this.currentChoices[i]]])
                    feedbackHTML += '<tr>' + theCols + '<td class="feedbackLineImg"><span class="small">' + this.feedbacks[this.displayChoices[this.currentChoices[i]]] + '</span></td></tr>';
            }
            else{
                feedbackHTML += '<td>' + choice + '</td></tr>';

                if (this.feedbacks[this.displayChoices[this.currentChoices[i]]])
                    feedbackHTML += '<tr>' + theCols + '<td class="feedbackLineTxt"><span class="small">' + this.feedbacks[this.displayChoices[this.currentChoices[i]]] + '</span></td></tr>';
            }

            feedbackHTML += '<tr>' + theCols + '<td class="feedbackLineSpacer">&nbsp;</td></tr>';
            feedbackHTML += '</table>';
        }
        
        var goodAnswerCountRequired = this.goodAnswers.length;
        if(this.mustGiveAllGoodAnswers == false){
            goodAnswerCountRequired = 1;
        
            var wrongAnswerCountPossible = this.choices.length - this.goodAnswers.length;
        
            var goodAnswerPonderation = ((goodAnswerCount > 0) ? this.ponderation : 0);
            var wrongAnswerPonderation = this.ponderation / wrongAnswerCountPossible;
            
            this.currentScore = Math.max((goodAnswerPonderation - (wrongAnswerPonderation * wrongAnswerCount)),0);
        }else{
            this.currentScore = (Math.min(Math.max((goodAnswerCount - wrongAnswerCount),0),goodAnswerCountRequired) / goodAnswerCountRequired) * this.ponderation;  
        }
        
        this.status = this.quiz.statusToRedo;
        if(this.currentChoices.length == 0){
            feedbackHTML = '<span class="Yellow">' + this.quiz.incompleteAnswerLabel + '</span><br /><br />' + feedbackHTML;
            this.currentScore = 0;
        }else if(this.currentScore == this.ponderation){
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

        for(i = 0;i < this.choices.length;i++){
            for(var j = 0;j < this.goodAnswers.length;j++){
                if (this.goodAnswers[j] == this.displayChoices[i]){
                    var choice = this.choices[this.displayChoices[i]];
                    var choiceType = this.choicesType[this.displayChoices[i]];
                    var theGoodAnswer = this.displayChoices[i];

                    if(this.labelType == this.ALPHA)
                        label = getLetterLabel(i + 1).toUpperCase() + ')';
                    else if(this.labelType == this.NUMERIC)
                        label = (i + 1) + ')';

                    solutionHTML += '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="feedbackTable">';
                    solutionHTML += '<tr>';
                    if (this.labelType > 0)
                        solutionHTML += '<td width="25">' + label + '</td>';

                    if (choiceType == 1){
                        var temp = new Element('div');
                        temp.appendChild(nq4_buildImageObject(this.choices[theGoodAnswer],this.iChoiceWidth,this.iChoiceMaxHeight,this.quiz.mediasFolder));
                        solutionHTML += '<td>' + temp.innerHTML + '</td>';
                    }
                    else{
                        solutionHTML += '<td>' + choice + '</td>';
                    }

                    solutionHTML += '</tr>';

                    if (this.labelType > 0)
                        solutionHTML += '<tr><td width="25">&nbsp;</td><td class="feedbackLineSpacer">&nbsp;</td></tr>';
                    else
                        solutionHTML += '<tr><td class="feedbackLineSpacer">&nbsp;</td></tr>';

                    solutionHTML += '</table>';
                }
            }
        }
        setFeedback(solutionHTML);
        openFeedback();
    },
    
    redo: function(){
        this.currentChoices = null;
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;

        closeFeedback();
        this.display();
    },

    redoQuiz: function(){
        this.currentChoices = null;
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;
    },
    
    isAnswered: function() {
        var toReturn = false;
    
        for(i = 0;i < this.inputs.length;i++){
            if (this.inputs[i].checked){
                toReturn = true;
            }
        }
        
        return toReturn;
    },

    shuffleChoices: function(o){
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    getConsigne: function(){
        return this.quiz.consigneMultipleAnswers;
    }
});