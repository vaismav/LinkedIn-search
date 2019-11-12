//search example:
//avi,mor,adi,herzel,sharon,dor,ben,dudi,elik,roi,stav,amit,yana,or

var numOfTabs = 5;
var openTabs=0;
var debugMode = false;
var searchMatrix;

//                              <------Listeners Sections------->

/**
 * alert when the background is about to be unload
 */
chrome.runtime.onSuspend.addListener(function (event) {
    console.log("page is about to get suspended");
})

/**
 * listening to the inital message from the content script
 * which telling the tab is opend.
 * the main purpose of it is to give the content script info about the tab 
 * which the content script doesnt have access to.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.action == "tabIsReady"){
        let message = {action: "connect", tabId: sender.tab.id, url: sender.tab.url};
        console.log("sending message: "+ JSON.stringify(message) +"\nto tab "+ sender.tab.id);
        sendResponse(message);
    }
});

/**
 * listenning for new port conections
 */
chrome.runtime.onConnect.addListener(onConnect);


/**
 * listenning for actions in the extension pop up
 */
document.addEventListener('DOMContentLoaded', function() {
    table ="text";
    var searchButton = document.getElementById('sample');
    var clearButton = document.getElementById('clearStorage');
    if(searchButton){
        searchButton.addEventListener('click',openLinkedin
        , false)
    }
    if(clearButton){
        clearButton.addEventListener('click',clearStorage
        , false)
    }
}, false);

//                              <------General Functions Sections------->

/**Method: isEmptyObject
 * checks if @param obj is empty
 * @returns true if empty, otherwise false
 */
function isEmptyObject(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**Method: waittingMessage
 * alerting with a random nice message
 */
function waittingMessage(){
    let sentances =["\"Happiness is a state of mind. It's just according to the way you look at things.\" Walt Disney","\"You are responsible for your own happiness. If you expect others to make you happy, you will always be disappointed.\" —Unknown","\"Working towards success will make you a master, but working towards satisfaction makes you a legend.\" —Unknown","\"It’s not what you do, it's how you do it! It’s not what you see, it’s how you look at it! It’s not how your life is, it’s how you live it.\" —Unknown","\"Life is full of beauty. Notice it. Notice the bumblebee, the small child, and the smiling faces. Smell the rain, and feel the wind. Live your life to the fullest potential, and fight for your dreams.\" —Ashley Smith","\"One of the simplest ways to stay happy: just let go of the things that make you sad.\" —Unknown","\"Just because it's not what you were expecting doesn't mean it's not everything you've been waiting for.\" —Unknown","\"The best things in life are unexpected because there were no expectations.\" —Eli Khamarov","\"If you don't know where you are going, any road will get you there.\" —Lewis Carroll","\"Life is like a piano . . . what you get out of it depends on how you play it.\" —Tom Lehrer","\"The most important things in life aren't things.\" —Anthony J. D'Angelo","\"Words can never replace feelings.\" —Unknown","\"If you want happiness for a day, go fishing.\nIf you want happiness for a month, get married.\nIf you want happiness for a year, inherit a fortune.\nIf you want happiness for a lifetime, help someone else.\" —Chinese Proverb","\"In the hopes of reaching the moon, men fail to see the flowers that blossom at their feet.\" —Albert Schweitzer","\"People with many interests live not only longest, but happiest.\" —George Matthew Allen","\"A difference in your life today will start when you choose to move on from what happened yesterday.\" —Unknown","\"Our truest life is when we are in dreams awake.\" —Henry David Thoreau","\"A time comes when you realize who matters, who doesn’t, and who never will. Don't worry about people from your past; there is a reason why they are not in your future!\" —Unknown","\"The happiest people don't have the best of everything. They just make the best of everything.\" —Unknown","\"Training yourself to live in the present, without regretting the past or fearing the future, is a recipe for a happy life.\" —Jonathan Lockwood","\"It's true that we don't know what we've got until we lose it, but it's also true that we don't know what we've been missing until it arrives.\" —Stephenie Meyer","\"Being happy doesn't mean that everything is perfect. It means that you've decided to look beyond the imperfections.\" —Gerard Way","\"We tend to forget that happiness doesn't come as a result of getting something we don't have, but rather of recognizing and appreciating what we do have.\" —Frederick Keonig","\"People are just about as happy as they make up their minds to be.\" —Abraham Lincoln","Never compare your weaknesses to other people’s strengths.","Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.","Your childhood may not have been perfect, but it’s over.","Own your life, or someone will own it for you","We cannot change the cards we are dealt, just how we play the hand.","The world does not reward perfectionists. It rewards those who get things done.","No matter what anyone says to you, you don’t have to eat dinner with them, live with them, or go to bed with them.","If you risk nothing, you risk everything.","If something frightens you irrationally, do it often.","Laugh and the world laughs with you. Weep and you weep alone.","You don’t have to do anything you don’t want to do, but you may miss out on future opportunities.","Don’t give others the power to control your emotions. Those are only yours and it is only for you to manipulate.","Victory introduces you to the world, but defeat introduces the world to you!","The only way you are going to have success is to have lots of failures first.","Fail often but do not forget the Lesson.","You will become way less concerned with what other people think of you when you realize how seldom they do.","It’s not what you say, it’s what people hear.","Take what you do seriously. Not yourself.","Life begins where your comfort zone ends.","The True measure of a man is how he treats someone who can do him absolutely no good.","If you don’t do stupid things while you’re young, you’ll have nothing to smile about when you’re old.","Man: “I want happiness” Buddha: “First remove ‘I’, this is ego, then remove ‘want’, this is desire. All that remains is happiness.”","Be who you are and say what you feel, because those who mind don’t matter, and those who matter don’t mind.","I always wondered why somebody didn’t do something about that, then I realized I am somebody.","Don’t waste your time with explanations, people only hear what they want to hear.","Don’t rest after your first victory because if you fail the second, time more lips will be waiting to say that your first victory was just luck.","Do not educate your children to be rich. Educate them to be happy. So when they grow up, they will know the value of things, not the price.","Everyone thinks of changing the world, but no one thinks of changing themselves.","We make a living by what we get. We make a life by what we give.","Information is not knowledge."];
    alert("Please wait until all tabs are opend and fully loaded! \n\n========================================\n\n Sentence of the Search:\n" + sentances[Math.floor(Math.random() * sentances.length)]);
}

/**Method: debugAlert
 * fire alert with @param msg if @param isActive and @var debugMode are true
 * @param {*} msg string
 * @param {*} isActive boolean
 */
function debugAlert(msg, isActive){
    console.log(msg);
    if(debugMode && isActive ){
        alert(msg);
    }
}

/**Method: wait
 * create a delay of @param {*} ms in busy wait loop
 */
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

 /**Method: indexOfFirstEmptyCell
  * @returns the index of the next cell with null value
  * in @param {*} array 
  */
 function indexOfFirstEmptyCell(array){
    for(var i=0 ; i < array.length ; i++){
        if(array[i] == null){
           return i;
        }
    }
    return -1;
}

/**Method: isOpenedUrl
 * checks if there is a tab open with @param url address
 * @param {string} url 
 * @param {Tabs[]} tabsArray 
 * @returns {boolean}
 */
function isOpenedUrl(url, tabsArray){
    let foundMatch = false;
    let i=0;
    for(; i < tabsArray.length && !foundMatch ; i++ ){
        if(tabsArray[i].url == url){
            foundMatch=true;
        }
    }
    return foundMatch;
}

//                              <------Main Process Sections------->


/**Method: clearStorage
 * clearing the local storage to allow loading of past result
 */
function clearStorage(){
    chrome.storage.local.clear(() => {
        if(chrome.runtime.lastError){
            console.log("Error during cleaning of local storage. \nError: " + chrome.runtime.lastError.message);
            alert("Error during cleaning of local storage. \nError: " + chrome.runtime.lastError.message);
        }else{
            alert("YAY! Local storage cleared!");
        }
    });   
 }
 

/**Method: openLinkInNewTab
 * creating new tab with the address of @param {*} link 
 */
function openLinkInNewTab(link) {
    console.log('openLinkInNewTab');
    chrome.tabs.create({url:link, active:false}, function(tab) {  //the active property keeps the extention popup alive
        debugAlert('openLinkInNewTab: Tab ID: '+ tab.id , false);      
    });
}

/**Method: openLinkedin
 * open the first @var numOfTabs tabs
 */
function openLinkedin () {
    console.log("start searching on linkedIn");
    searchMatrix = [];
    const assets = document.getElementById('assets-input').value.split(',');
    const companies = document.getElementById('companies-input').value.split(',');
    const searchUrl = 'https://www.linkedin.com/search/results/all/?keywords=<searchTerm>&origin=GLOBAL_SEARCH_HEADER';
    assets.forEach((asset) => {
        companies.forEach((company) => {
            const searchTerm = `${asset} ${company}`;
            const link = searchUrl.replace('<searchTerm>', encodeURIComponent(searchTerm));
            searchMatrix.push(link);
        });
    });
    console.log("initial search matrix:");
    console.log(searchMatrix);
    let i =0;
    for(; i < numOfTabs && 0 < searchMatrix.length && i < searchMatrix.length ; i++){
        openLinkInNewTab(searchMatrix.shift());
        chrome.storage.local.set({searchMatrix: searchMatrix},null);
    };
}

/**Method: openNextSearch
 * the method checks if there arent more opened search tabs than @var numOfTabs
 * if there arent, load the searchMatrix from the local strage, 
 * create new tab of the next search and save searchMatrix without the new search
 * in the local storage
 */
function openNextSearch(){
    chrome.tabs.query({url: "https://www.linkedin.com/search/results/all/*"}, function (tabs) {
        if(tabs.length < numOfTabs){
            chrome.storage.local.get(["searchMatrix"], function (result){
                if(isEmptyObject(result)){
                    alert("SEARCH FAILD!:: openNextSearch couldnt find the searchMatrix in the local storage");
                }
                else if(result.searchMatrix.length > 0){
                    let searchMatrix = result.searchMatrix;
                    let nextSearch = searchMatrix.shift();
                    chrome.storage.local.set({searchMatrix: searchMatrix},null);
                    debugAlert("openNextSearch: searchMatrix = [" + result.searchMatrix.toString() + "]",false);           
                    if(!isOpenedUrl(nextSearch,tabs)){
                        openLinkInNewTab(nextSearch);
                    }
                }
                else{
                    debugAlert("openNextSearch: searchMatrix is empty!",false);
                } 
            });
        }
    });
}


/**Method: onConnect
 * define the behavore of the port connection
 * @param {*} port 
 */
function onConnect(port){
    debugAlert("connected to port: "+ port.name, false);
    port.onMessage.addListener(function(msg) {
        debugAlert("got message from tab " + port.name + " : " + JSON.stringify(msg), false);
        if(msg.action == "tabNotChanged"){
            //add documantion of all closed tabs in this session
            openTabs--;
            chrome.tabs.remove(msg.tabId, null);
        }
        else if(msg.action == 'tabLoaded'){
            port.postMessage({action: "checkResult"});
        }
        else if(msg.action == 'savedTab'){
            console.log("tab "+ port.name +" saved to local storage");
        }
    });
    port.onDisconnect.addListener((event) =>{
        debugAlert("disconnect from port " + port.name, false);
        openNextSearch();
    })
}
