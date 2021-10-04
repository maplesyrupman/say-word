var timecountdown = 90;
var timeInterval;
var landingPage = document.getElementsByClassName('landing-flex-container');
var quizCard = document.getElementsByClassName('quiz-flex-container');
var para1 = document.createElement("p");
var para2 = document.createElement("p");
var para3 = document.createElement("p");
//Time
var time = document.createElement("h3");
var quizCardId=document.querySelector("#quiz-flex-container-id");
var quizCardItem = document.querySelector("#quiz-flex-item");
//Intial index
var index = 0;
var correctAnswer="";
var answerPara=document.createElement("p");
var textbox = document.createElement("INPUT");
textbox.setAttribute("type", "text");




let testDefObj = {
    word: 'interest',
    audioUrl: 'https://media.merriam-webster.com/audio/prons/en/us/mp3/i/intere01.mp3',
    defs: [{
            fl: 'noun',
            defSentances: [
                "a feeling that accompanies or causes special attention to something or someone : concern",
                "something or someone that arouses such attention",
                "a quality in a thing or person arousing interest"
            ]
        },
        {
            fl: 'adjective',
            defSentances: [
                "to engage the attention or arouse the interest of",
                "to induce or persuade to participate or engage"
            ]
        }
    ]
}

var listOfTestObject = [testDefObj, testDefObj, testDefObj, testDefObj, testDefObj];
console.log(listOfTestObject[0]);

const dictionary = (() => {

    let words = {};

    const getDef = word => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=eef68214-e15e-46fc-8e3b-5c0c4330f2db`;

        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {

                    words[word] = createDefObj(data, word);
                });
            }
        })
    }

    const getAntSyn = word => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=15205c99-2cb8-498d-a9f9-f5bdc4865029`;

        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data)
                });
            }
        });
    }

    const stripAstr = word => {
        let strippedArr = word.split('*');
        return strippedArr.join('');
    }

    const createDefObj = (defArr, word) => {
        let defObj = {
            word: word,
            audioUrl: getAudioUrl(defArr),
            defs: []
        };
        for (let i = 0; i < defArr.length; i++) {
            let currentDef = defArr[i];
            if (stripAstr(currentDef.hwi.hw) == word) {
                let type = {
                    fl: currentDef.fl,
                    defSentances: currentDef.shortdef
                };
                defObj.defs.push(type);
            } else {
                break;
            }
        }
        return defObj
    }

    const getAudioUrl = defArr => {
        let baseFilename = defArr[0].hwi.prs[0].sound.audio;
        let subdirectory = (baseFilename.substr(0, 3) == 'bix') ? 'bix' :
            (baseFilename.substr(0, 3) == 'gg') ? 'gg' :
            baseFilename[0];
        return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${baseFilename}.mp3`
    }

    const getWords = () => {
        return words;
    }

    return {
        getDef,
        getAntSyn,
        stripAstr,
        getAudioUrl,
        getWords
    }
})();

const domOps = (() => {
    const createDefCard = (defObj) => {
        let definitionCard = document.createElement('div');
    }

    return {
        createDefCard,
    }
})();

const storage = (() => {

        let sayhi = function() {
            console.log('hi');
        }

        return {
            sayhi
        }
    })()

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




function getQuizCard() {

    

     //console.log(index);

    // Removing landing page element
    landingPage[0].style.display = 'none';



    if (this.listOfTestObject.length < 3) {
        prompt("Please add more words to take quiz.To memorize minimum 3 words should be added.");

    } else {

        // Card style

       
        
        
        quizCard[0].style.display = 'flex';
       
        generateQuiz();






    }




}

/*
#########################################################
Function name : generateQuiz()
Description
- Generates quiz from local storage
 #########################################################
*/

function generateQuiz() {

    console.log(index);

    if(index==3){
        showScore();
        return;
    }
    
    document.getElementById("btn-strt-quiz").disabled = true;
    answerPara.textContent="";
    textbox.value="";

    
    // Card title
    var listOfObject =[];
    var wordsToTest=[];
    var fetchedAddedWordsFromLocalStorage = JSON.parse(localStorage.getItem("addedWords"));
    
    
    for (var i = 0, length = fetchedAddedWordsFromLocalStorage.length; i < length; i++) {
        for (obj in fetchedAddedWordsFromLocalStorage[i]) {
            
            var attr = String(obj);
            listOfObject.push(fetchedAddedWordsFromLocalStorage[i][attr]);
        
        }
    }
        
    console.log(listOfObject);

    for(let i=0;i<3;i++){
        
        wordsToTest.push(listOfObject[i]);
        
    }

      console.log(wordsToTest);
     
    
    quizTitle=document.createElement("h3");
    quizTitle.textContent = "Quiz";
    var quizIns = document.createElement("p");
    quizIns.classList.add("text-lable");
    quizIns.textContent = "The following are definations/meanings of words: "
    var quizUl = document.createElement("ul");
    quizUl.classList.add("list-group");
    quizUl.style.marginLeft = "50px";
    quizUl.style.marginTop = "25px";
    quizUl.style.marginBottom = "25px";
    var quizLiOne = document.createElement("li");
    var quizLiTwo = document.createElement("li");
    var quizLiThree = document.createElement("li");
    quizLiOne.classList.add("list-group-item");
    quizLiOne.classList.add("list-group-item-success");
    quizLiTwo.classList.add("list-group-item");
    quizLiTwo.classList.add("list-group-item-primary");
    quizLiThree.classList.add("list-group-item");
    quizLiThree.classList.add("list-group-item-warning");
    
    
    para1.textContent = wordsToTest[index].defs[0]!==undefined? "1. " + wordsToTest[index].defs[0].defSentances[0] :quizLiOne.style.display ="none";
    para2.textContent = wordsToTest[index].defs[1]!==undefined? "2. " + wordsToTest[index].defs[1].defSentances[0]:quizLiTwo.style.display ="none";
    para3.textContent = wordsToTest[index].defs[2]!==undefined? "3. " + wordsToTest[index].defs[2].defSentances[0]:quizLiThree.style.display ="none";
    correctAnswer =wordsToTest[index].word;
    quizLiOne.appendChild(para1);
    quizLiTwo.appendChild(para2);
    quizLiThree.appendChild(para3);
    quizUl.appendChild(quizLiOne);
   // quizUl.appendChild(document.querySelector("br"));
    quizUl.appendChild(quizLiTwo);
    //quizUl.appendChild(document.querySelector("br"));
    quizUl.appendChild(quizLiThree);
    //quizUl.appendChild(document.querySelector("br"));
    var labelTextbox = document.createElement("p");
    labelTextbox.classList.add("text-lable");
    labelTextbox.textContent = "Guess the word"
    textbox.classList.add("text-box-guess");
    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("quiz-button");
    button.textContent = "Next"
    button.addEventListener("click",onNext);
    var buttonLeave = document.createElement("button");
    buttonLeave.classList.add("btn");
    buttonLeave.classList.add("btn-danger");
    buttonLeave.classList.add("quiz-button");
    buttonLeave.textContent = "Exit Quiz";
    buttonLeave.addEventListener("click",goToHome);
    var textboxDiv =document.createElement("div");
    textboxDiv.classList.add("quiz-align");
    var buttonDiv=document.createElement("div");
    buttonDiv.classList.add("quiz-align");
    var buttonLeaveDiv=document.createElement("div");
    buttonLeaveDiv.classList.add("quiz-align");
    textboxDiv.appendChild(textbox);
    buttonDiv.appendChild(button);
    buttonLeaveDiv.appendChild(buttonLeave);
    quizCardItem.appendChild(quizTitle);
    quizCardItem.appendChild(time);
    quizCardItem.appendChild(quizIns);
    quizCardItem.appendChild(quizUl);
    quizCardItem.appendChild(labelTextbox);
    quizCardItem.appendChild(textboxDiv);
    quizCardItem.appendChild(answerPara);
    quizCardItem.appendChild(buttonDiv);
    quizCardItem.appendChild(buttonLeaveDiv);
    quizCardId.appendChild(quizCardItem);
    starTimer();

}

/*
#########################################################
Function name : starTimer()
Description
- This function is used to start timer
#########################################################
*/

function starTimer() {
    timeInterval = setInterval(function() {
        timecountdown--;



        time.style.color='blue';
        time.innerHTML = "<br/>Time: "+ timecountdown;
        console.log(1);
        if (timecountdown === 0) {
            alert("TIME UP !!");
            showScore();
          
        }
    }, 1000);
}

/*
#########################################################
Function name : addWordsToLocalStorage()
Description
- Create a list of searched words in localStorage
Developer Name : Shanthoshkanna (y.shanthosh@gmail.com)
#########################################################
*/

function addWordsToLocalStorage() {
    var searchedWords = dictionary.getWords();
    console.log(searchedWords);
    const key = "addedWords"; // Key for local storage
    var Def = new Set(); // Set to avoid duplicates
    const addedWords = JSON.parse(localStorage.getItem(localStorage.key(0)));
    // Prompt to confirm adding words
    var confirmBox = confirm("Do You Want To Add This To Your List?");

    // if word already exsists
    if (confirmBox == true) {
        if (addedWords != null) {
            // Work in progress for prompt when duplicate
            /*if (addedWords.includes(searchedWords)) {
                window.alert("You Have Already Added This Word To Your List");
                return
    
            }*/
            Def = new Set([...addedWords]); // Sets cannot be saved and retrieved in local storage therefore convert Sets to Arrays while storing.
        }

        Def.add(searchedWords);
        localStorage.setItem(key, JSON.stringify([...Def]));
    }
        //location.reload();


}




 /*
#########################################################
Function name : onNext()
Description
- Logic for next button
#########################################################
*/

function onNext(){

    
    index= index+1;
    //console.log(textbox.value);

    if(textbox.value==correctAnswer){
        answerPara.textContent ="Correct";
        answerPara.style.textAlign = "center";
    }else{
        answerPara.textContent ="Wrong";
        answerPara.style.textAlign = "center";
    }

   
  
    setTimeout(() => {   
         $(quizCardItem).empty();
         generateQuiz();
      
    },1000);
   


}

/*
#########################################################
Function name : ShowScore()
Description
- Logic to see score
#########################################################
*/
    
function showScore(){
    console.log(timeInterval);
    clearInterval(timeInterval);
    $(quizCardItem).empty();
     var showScoreTitle= document.createElement("h3");
     var score = document.createElement("p");
     var buttonDiv=document.createElement("div");
     var ins = document.createElement("p");
     ins.classList.add("quiz-align");
     ins.innerHTML ="<br/>"+"Click here go to home page"
     buttonDiv.classList.add("quiz-align");
     var buttonHome = document.createElement("button");
     buttonHome.classList.add("btn");
     buttonHome.classList.add("btn-primary");
     buttonHome.classList.add("quiz-button");
     buttonHome.textContent = "Home Page"
     buttonHome.addEventListener("click",goToHome);
     buttonDiv.appendChild(buttonHome);
     score.classList.add('quiz-align');
     showScoreTitle.textContent="YOUR SCORE IS: ";
     score.innerHTML="<br/>"+timecountdown;
     quizCardItem.appendChild(showScoreTitle);
     quizCardItem.appendChild(score);
     quizCardItem.appendChild(ins);
     quizCardItem.appendChild(buttonDiv);
}

/*
#########################################################
Function name : goToHome()
Description
- Logic to go to home page
#########################################################
*/
function goToHome(){
    console.log(timeInterval);
    clearInterval(timeInterval);
    quizCard[0].style.display = 'none';
    landingPage[0].style.display = 'flex';
    document.getElementById("btn-strt-quiz").disabled = false;
}



