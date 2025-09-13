var QuestionLongText = Class.create({
    //settings
    
    feedback: null,
    input: null,
    currentText: '',
    
    currentScore: 0,
    ponderation: 0,
    triesCount: 0,
    status:'',
    
    initialize: function(quiz, page, questionNb){
        this.quiz = quiz;
        this.page = page;
        this.questionNb = questionNb;
        
        this.status = this.quiz.statusToDo;
    },
    
    setFeedback: function(feedback){
        this.feedback = feedback;
    },
    
    display : function(){
        this.input = tcals_createElement('textarea','txtLongText');
        this.input.value = this.currentText;
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
        
        this.showSolution();

        this.currentScore = this.ponderation;
        this.status = this.quiz.statusCompleted;
        
        return this.currentScore;
    },
    
    showSolution: function(){
        var solutionHTML;

        solutionHTML = this.quiz.suggestionLabel + '<br /><br />';

        if(this.feedback)
            solutionHTML += this.feedback;
        
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
        return this.quiz.consigneLongText;
    }
});