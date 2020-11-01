var budgetController=(function(){
    
    var Expense=function(id,description,value){
        this.id=id;
            this.descrption=description;
            this.value=value;
    };
     var Income=function(id,description,value){
        this.id=id;
            this.descrption=description;
            this.value=value;
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItem[type].forEach(function(cur){
            sum=sum+cur.value;
        });
        data.totals[type]=sum;
    };
    
    var data={
        allItem:{
            inc:[],
            exp:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    return{
        addItem:function(type,des,val){
            var newItem,ID;
            //Create new id
            if(data.allItem[type].length>0){
                 ID=data.allItem[type][data.allItem[type].length-1].id+1;
            }
            else{
                ID=0;
            }
           
            //create new item based on Inc Exp
            if(type==='exp'){
                newItem=new Expense(ID,des,val);
            }else if(type==='inc'){
                 newItem=new Income(ID,des,val);
            }
            //Push it intp our data structure
            data.allItem[type].push(newItem);
            //Return the new element
            return newItem;
        },
        
        calculateBudget:function(){
            //Calculate total exp and inc
            calculateTotal('exp');
            calculateTotal('inc');
            
            //Calculate iNcome
            data.budget=data.totals.inc-data.totals.exp;
            //calculate Percentage
            if(data.totals.inc>0){
                 data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
           else{
               data.percentage=-1;
           }
        },
        
        getBudget:function(){
        return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };
        },
        
        
        testing:function(){
            console.log(data);
        }
    };
    
})();


var uiController=(function(){
    var DomStrings={
      inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses',
        budgetLabel:'.budget_value',
        incomeLabel:'.budget__income--value',
        expanseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage'
    };
    return{
        getInput:function(){
            return{
                type:document.querySelector(DomStrings.inputType).value,
                descrption:document.querySelector(DomStrings.inputDescription).value,
                value:parseFloat(document.querySelector(DomStrings.inputValue).value)
            };
        },
        addListItem:function(obj,type){
            var html,newHtml,element;
            
            //Create HTML string with Placeholder text
            if(type==='inc'){
                element=DomStrings.incomeContainer;
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%descrption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type==='exp'){
                element=DomStrings.expensesContainer;
               html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%descrption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace the placeholder text actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%descrption%',obj.descrption);
            newHtml=newHtml.replace('%value%',obj.value);
            
            //Inseart the Html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        clearField:function(){
          var fields,fieldArray;
            fields=document.querySelectorAll(DomStrings.inputDescription+','+DomStrings.inputValue);
            fieldArray=Array.prototype.slice.call(fields);
            fieldArray.forEach(function(current,index,array){
                current.value="";
            });
            fieldArray[0].focus();
        },
        displayBudget:function(obj){
            document.querySelector(DomStrings.budgetLabel).textContent=obj.budget;
             document.querySelector(DomStrings.incomeLabel).textContent=obj.totalInc;
             document.querySelector(DomStrings.expanseLabel).textContent=obj.totalExp;
            
            if(obj.percentage>0){
                 document.querySelector(DomStrings.percentageLabel).textContent=obj.percentage+'%';
            }else{
                 document.querySelector(DomStrings.percentageLabel).textContent='---';
            }
            
        },
        getDomString:function(){
        return DomStrings;
    }
    };
    
})();



var Controller=(function(budgetCntrl,uiCntrl){
    var setupEventlisener=function(){
         var DOM=uiCntrl.getDomString();
         document.querySelector(DOM.inputBtn).addEventListener('click',addCntrl);
    document.addEventListener('keypress',function(event){
        if(event.keyCode===13 || event.which===13){
            addCntrl();
        }
    });
    };
    
    var updateBudget=function(){
        //1. Calculate the Budget
        budgetCntrl.calculateBudget();
        
        //2. return the budget
        var budget=budgetCntrl.getBudget();
        //Display the budget
        uiCntrl.displayBudget(budget);
    }
   
    var addCntrl=function(){
        //1. Get the field input data
        var input,newItem
        input=uiCntrl.getInput();
        if(input.descrption!=="" &&!isNaN(input.value) &&input.value>0){
            //2. Add the item to the budget Controller
        newItem=budgetCntrl.addItem(input.type,input.descrption,input.value);
        
        //add Item to the UI
        uiCntrl.addListItem(newItem,input.type);
        
        //4. clear the field
        uiCntrl.clearField(); 
            
            //5. Calculate and update budget
            updateBudget();
            
        }
        
        
        
    };
    
    return{
        init:function(){
            console.log('Application has been started');
            uiCntrl.displayBudget({
                 budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventlisener();
        }
    };
    
   
    
    
})(budgetController,uiController);


Controller.init();