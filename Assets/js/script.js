/*
#########################################################
Function name : getQuizCard
Description
- Randomly use random 3 words from list of local storage words
- Display defination and ask for word
- Check right or wrong
- Display results or start quiz again
- To start quiz altleast three words should be added to local storage words
#########################################################
*/

var addedWordsToLocalStorage = [
    {"name":"Mango", "defination":"Yellow color fruit"},
    {"name":"Russia", "defination":"Country where people speaks Russian"},
    {"name":"University", "defination":"Place to study"},
    {"name":"Joker", "defination":"Circus man who is funny"},
    {"name":"Love", "defination":"Abstract feeling of affection"}
    
];
var timecountdown = 45;
var landingPage = document.getElementsByClassName('coming-soon');
var quizCard =  document.getElementsByClassName('quiz-flex-container');
var quizCardItem=document.getElementsByClassName('quiz-flex-item one');
var para1 = document.createElement("p"); 
var para2 = document.createElement("p"); 
var para3 = document.createElement("p"); 
var quizTilte = document.createElement("h3");
//Time
var timeEl = document.querySelector("#cnt");


function getQuizCard(){

    // need to put code to remove landing page element
    landingPage[0].style.display='none';

      
    if(this.addedWordsToLocalStorage.length<3){
        prompt("Please add more words to take quiz.To memorize minimum 3 words should be added.");
    
    }else{
       
       quizCard[0].style.display='flex';
       starTimer();
         
       //var randomThreeWords;

      /* for (let i = 0; i <3; i++) {
        
      }*/
       

      
    }




}
/*
#########################################################
Function name : starTimer()
Description
- This function is used to start timer
#########################################################
*/

function starTimer() {
    timeInterval = setInterval(function () {
      timecountdown--;
  
      this.timeEl.textContent = timecountdown;
  
      if (timecountdown === 0) {
        ShowScore();
        clearArea();
        //clearInterval(timeInterval);
      }
    }, 1000);
  }

  getQuizCard();