var QuestionShortText = Class.create({
    //settings
    goodAnswer: null,
    goodAnswerFeedback: null,
    wrongAnswers: null,
    wrongAnswersFeedbacks: null,
    otherAnswersFeedback: null,
    input: null,
    currentText: '',
    bCaseSens: false,
    bPoncCompte: false,
    
    currentScore: 0,
    ponderation: 0,
    triesCount: 0,
    status:'',
    
    initialize: function(quiz, page, questionNb){
        this.quiz = quiz;
        this.page = page;
        this.questionNb = questionNb;
        this.goodAnswers = new Array();
        this.goodAnswersClean = new Array();
        this.goodAnswersFeedbacks = new Array();
        this.wrongAnswers = new Array();
        this.wrongAnswersFeedbacks = new Array();
        this.status = this.quiz.statusToDo;
    },
    
    setGoodAnswer: function(goodAnswer, feedback){
        //À VOIR SI NECESSAIRE...
        //goodAnswer = nq4_entity_decode(goodAnswer);

        this.goodAnswers[this.goodAnswers.length] = goodAnswer;
        this.goodAnswersClean[this.goodAnswersClean.length] = goodAnswer;
        this.goodAnswersFeedbacks[this.goodAnswersFeedbacks.length] = feedback;
    },
    
    addWrongAnswer: function(wrongAnswer, feedback){
        this.wrongAnswers[this.wrongAnswers.length] = wrongAnswer;
        this.wrongAnswersFeedbacks[this.wrongAnswersFeedbacks.length] = feedback;
    },
    
    setOtherAnswersFeedback: function(feedback){
        this.otherAnswersFeedback = feedback;
    },
    
    display : function(){
        this.input = tcals_createElement('textarea','txtLongText');
        this.input.value = this.currentText;
        this.input.style.width = '550px';
        this.input.style.height = '40px';
        this.input.style.padding = '2px';
        $('question').update(this.input);
    },

    save: function(){
        this.currentText = '';

        if (this.input != null)
            this.currentText = this.input.value;
        
        return this.currentText;
    },
    validate: function(){
        this.save();
        this.triesCount++;
        
        var bulletImage = 'bullet_red.jpg';
        var feedbackHTML = '';
        var feedback = '';
        var currentText = cleanForValid(this.currentText);

        if (this.bPoncCompte == false){
            for(var i = 0;i < this.goodAnswers.length;i++){
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\,/g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\./g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\;/g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\:/g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\!/g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\?/g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\«/g, '');
                this.goodAnswersClean[i] = this.goodAnswersClean[i].replace(/\»/g, '');
            }
        }


        if(currentText.length > 0){
            var foundGood = false;
            var foundWrong = false;

            for(var i = 0;i < this.goodAnswers.length;i++){
                if (this.bCaseSens == false){
                   if(this.goodAnswers[i].toLowerCase() == currentText.toLowerCase() || this.goodAnswersClean[i].toLowerCase() == currentText.toLowerCase()){
                       if (foundGood == false){
                           foundGood = true;
                           this.currentScore = this.ponderation;
                           feedbackHTML += '<span class="Green">' + this.quiz.goodAnswerLabel + '</span><br /><br />';
                           bulletImage = 'bullet_green.jpg';
                           feedback = this.goodAnswersFeedbacks[i];
                       }
                   }
                }
                else{
                   if(this.goodAnswers[i] == currentText || this.goodAnswersClean[i] == currentText){
                       if (foundGood == false){
                           foundGood = true;
                           this.currentScore = this.ponderation;
                           feedbackHTML += '<span class="Green">' + this.quiz.goodAnswerLabel + '</span><br /><br />';
                           bulletImage = 'bullet_green.jpg';
                           feedback = this.goodAnswersFeedbacks[i];
                       }
                   }
                }
            }

            if (foundGood == false){
                this.currentScore = 0;
                feedbackHTML += '<span class="Red">' + this.quiz.wrongAnswerLabel + '</span><br /><br />';
                
                for(var i = 0;i < this.wrongAnswers.length;i++){
                    if(this.wrongAnswers[i].toLowerCase() == currentText.toLowerCase()){
                        foundWrong = true;
                        feedback = this.wrongAnswersFeedbacks[i];
                    }
                }
            }

            if (foundGood == false && foundWrong == false)
                feedback = this.otherAnswersFeedback;
            
            feedbackHTML += '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="feedbackTable">';
            feedbackHTML += '<tr>';
            feedbackHTML += '<td width="20"><img src="images/base/' + bulletImage + '" /></td>';
            feedbackHTML += '<td>' + currentText + '</td></tr>';
            feedbackHTML += '<tr><td width="20">&nbsp;</td><td class="feedbackLineTxt"><span class="small">' + feedback + '</span></td>';
            feedbackHTML += '</tr>';
            feedbackHTML += '</table>';
        
        }else{
            feedbackHTML = '<span class="Yellow">' + this.quiz.incompleteAnswerLabel + '</span>';
        }
        this.status = this.quiz.statusToRedo;
        if(this.currentScore == this.ponderation)
            this.status = this.quiz.statusCompleted;
        
        setFeedback(feedbackHTML);
        openFeedback();
        
        return this.currentScore;
    },
    
    showSolution: function(){
        var solutionHTML =  this.quiz.solutionLabel + '<br /><br />';
        var strGoodAnswers = '';

        for(var i = 0;i < this.goodAnswers.length;i++){
            if (strGoodAnswers == '')
                strGoodAnswers += this.goodAnswers[i];
            else
                strGoodAnswers += " / " + this.goodAnswers[i];
        }
    
        solutionHTML += strGoodAnswers;
        
        setFeedback(solutionHTML);
        openFeedback();
    },
    
    redo: function(){
        this.currentText = '';
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;

        closeFeedback();
        this.display();
    },

    redoQuiz: function(){
        this.currentText = '';
        this.currentScore = 0;
        this.status = this.quiz.statusToRedo;
    },
    
    isAnswered: function() {
        var toReturn = false;
        
        if(this.input.value.length > 0)
            toReturn = true;
        
        return toReturn;
    },
    getConsigne: function(){
        return this.quiz.consigneShortText;
    }
});