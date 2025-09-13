var indiceWindow = null;
var identFormWindow = null;

var DraggableWindow = Class.create({
    mainElement: null,
    handleElement: null,
    
    //Construct
    initialize: function(me,he){
        this.mainElement = me;
        this.handleElement = he;
        
        new Draggable(me,{handle:he, scroll:window, zindex:1000, starteffect:effectFunction(me), endeffect:effectFunction(me), onDrag:updateShime, onEnd:updateShime});
        
        this.mainElement.hide();
        $('shime').hide();
        try{
            $('shime').update();
        }catch(e){}
    },
    
    open: function(divId){
        this.mainElement.show();

        /*******CENTER SCREEN*******/
        /*var screenVisibleW = document.getElementById('pagewrapper').offsetWidth / 2;
        var screenVisibleH = document.getElementById('pagewrapper').offsetHeight / 2;
        
        var indiceW = document.getElementById('indice').offsetWidth / 2;
        var indiceH = document.getElementById('indice').offsetHeight / 2;

        var windowLeft = screenVisibleW - indiceW;
        var windowTop = screenVisibleH - indiceH;

        //A BIT HIGHER...
        if (document.getElementById('indice').offsetHeight < 100)
            windowTop = windowTop - 250;
        else if(document.getElementById('indice').offsetHeight < 200)
            windowTop = windowTop - 225;
        else if(document.getElementById('indice').offsetHeight < 300)
            windowTop = windowTop - 150;
        else
            windowTop = windowTop - 50;*/
        /***************************/


        var screenVisibleW = document.getElementById('pagewrapper').offsetWidth / 2;
        var screenVisibleH = document.getElementById('pagewrapper').offsetHeight / 4;
        screenVisibleH = screenVisibleH - 25;
        
        var divW = document.getElementById(divId).offsetWidth / 2;
        var divH = document.getElementById(divId).offsetHeight / 2;

        var windowLeft = screenVisibleW - divW;
        var windowTop = screenVisibleH;// - indiceH;


        this.mainElement.style.left = windowLeft + 'px';;
        this.mainElement.style.top = windowTop + 'px';

        $('shime').show();
        updateShime();
    },
    
    close: function(){
        this.mainElement.hide();
        $('shime').hide();
    }
});

function effectFunction(element)
{
   new Effect.Opacity(element, {from:0.2, to:1.0});
}

function updateShime(){
    $('shime').clonePosition(indiceWindow.mainElement);
}