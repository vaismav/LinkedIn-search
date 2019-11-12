console.log("content script is loaded");
var port;
var tabId;
var url;
var gotConnectRequest = false;

console.log("sending tabIsReady message ");
/**
 * sending the initial message to the background 
 * in order to get back the details about this tab
 */
chrome.runtime.sendMessage({action: "tabIsReady"},function (response){
    console.log("recived response to tabIsReady\n message: "+ JSON.stringify(response));
    if(!gotConnectRequest && response.action == "connect"){
        gotConnectRequest = true;
        tabId = response.tabId;
        url = response.url;
        connectToBackground();  
    }
});

/**Method: isEmpty
 * checks if obj is an empty Object 
 * @param {*} obj 
 */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**Method: setToLoaclStorage
 * put the {key: value} to local storage
 * @param {*} key 
 * @param {*} value 
 */
function setToLoaclStorage(key, value){
    let newObj = {};
    newObj[key]={
        data: value,
        lastChecked: null
    }
    console.log("new object:");
    console.log(newObj);
    chrome.storage.local.set(newObj,null);
}

/**Method: postToPort
 * printing the message to the console before posting to the port connection
 * @param {*} message 
 */
function postToPort(message){
    console.log("sending message: " + JSON.stringify(message));
    port.postMessage(message);
}



/**Method: inspectResults
 * chack if the search result are in the local storage
 * and if they have changed.
 * @param {*} resultsArray 
 * @returns {Object} of the message to be sent to the background
 */
function inspectResults(resultsArray){
    chrome.storage.local.get([url], function (result){
        console.log("get result from local storage");
        console.log(result);
        if(isEmpty(result)){
            console.log("no previuse record of this search in the local storage");
            setToLoaclStorage(url,resultsArray);
            postToPort({action: "savedTab", url: url});
        }
        else{
            let storageData =result[url].data, areEqual =true;
            if(resultsArray.length == storageData.length){
               for(i=0 ; i < resultsArray.length && !stop; i++){
                   if(resultsArray[i].title.text != storageData.title.text){
                        areEqual=false;
                   }
               }
            }
            else{
                areEqual=false;
            }
            if(areEqual){
                console.log("nothing new on" + url +" ; \n closing tab");
                postToPort({action: "tabNotChanged", url: url, tabId: tabId});
            }else{
                setToLoaclStorage(url,resultsArray);
                postToPort({action: "savedTab", url: url});      
            }
        }  
    });  
}

/**Method: getResultsArray
 * extract the search result from the HTML object
 * @param {Object} elements JSON object of the page HTML 
 * @returns {Array} array of the search results
 */
function getResultsArray(elements){
    let output = false;
    console.log("For Each element:");
    elements.forEach((element) => {
        console.log(element);
        if("elements" in element){
            if(element.elements.length>0){
                    output = element.elements;
            }    
        }
    });
    if(output){
        return output;
    }else{
        return ["NoSearchResults"];
    }
}

/**Method: getResults
 * extract the search data from the page html
 * @param {string} html 
 */
function getResults(html){
    let startIndex = html.indexOf("{\"data\":{\"metadata");
    let endIndex = html.indexOf("</code>",startIndex);
    return html.substring(startIndex,endIndex);
}

/**Method:htmlToJSON
 * Gets the outer html of the content document 
 * and extract array which contain the search result
 * @param {?} html
 * @returns array of JSONs 
 */
function htmlToJSON(html){
    console.log(html);
    let htmlJSON_string = getResults(html);
    console.log(htmlJSON_string);
    let htmlJSON_obj = JSON.parse(htmlJSON_string);
    console.log(htmlJSON_obj);
    return getResultsArray(htmlJSON_obj.data.elements);
}

/**Method: connectToBackground
 * create the connection between the specific tab's content script 
 * and the background script 
 */
function connectToBackground() {
    port =  chrome.runtime.connect({name: tabId.toString()});
    console.log("connected to port: " + port.name);
    port.onMessage.addListener(function(msg){
        console.log("start listenning for port messages");
        if(msg.action === "checkResult"){
            console.log("got " + msg.action + " message.");
            let resultsJSON_array = htmlToJSON(document.all[0].outerHTML);
            console.log(resultsJSON_array);
            console.log(url);
            inspectResults(resultsJSON_array);
            
        }
    });
    postToPort({action: "tabLoaded", tabId: tabId});
}
