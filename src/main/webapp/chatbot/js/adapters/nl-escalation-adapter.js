/**
 * This adapter creator export an adapter which hides the conversation window when the user types end in the query. It accepts
 * two entry arguments as the configuration options.
 */
function launchNLEsclationForm(checkAgents,escalateNLForm,rejectedEscalation,noAgentsAvailable,MaxNoResults) {
  var initMaxResults=3;
  var systemMessageEscalationID = "";
  var setEscalations=true;
  var noResults=1;
  var escalateSystemMessageData={
    message: 'escalate-chat',
    translate: true,
    options: [
        {label: 'yes',value:'yes'},
        {label: 'no', value:'no'}
      ]
  };
  if(typeof MaxNoResults == "undefined"){
    MaxNoResults = initMaxResults;
  }
  if(typeof escalateNLForm=='string' && escalateNLForm!==''){
    var sendEscalateForm={
      message:escalateNLForm
    };
  }else console.error("escalateNLForm must be a not emtpy string", escalateNLForm);
  if(!validateEscalateConditions(rejectedEscalation) || !validateEscalateConditions(noAgentsAvailable)) {
    setEscalations=false;
  }

  return function(chatBot){
    /**
     * Check for escalate and no-results flags, and display a SystemMessage offering escalation.
     * @param  {[Object]}   messageData [The current MessageData to be displayed]
     * @param  {Function} next        [Callback]
     * @return {[next]}               [next]
     */
    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
      if(typeof messageData.flags!=="undefined" && setEscalations) {
        if (messageData.flags.length>0) {
            if(messageData.flags.indexOf('escalate')!==-1){
              systemMessageEscalationID = chatBot.actions.displaySystemMessage(escalateSystemMessageData);
              chatBot.actions.disableInput();
              return;
            }else if(messageData.flags.indexOf('no-results')!==-1){
              if(noResults >= MaxNoResults){
                systemMessageEscalationID = chatBot.actions.displaySystemMessage(escalateSystemMessageData);
                chatBot.actions.disableInput();
                return;
              }else {
                noResults++;
              }
            } else {
              noResults=1;
            }
        }else {
          noResults=1;
        }
      }
      return next(messageData);

    });
    /**
     * Subscription to DisplayAgentResponse, to check if the user wants to escalate
     * Check ID to be sure it's our agentMessage and the option selected
     * @param  {[Object]}   optionData [Option selected]
     * @param  {Function} next       [Next callback to be returned]
     */
    chatBot.subscriptions.onSelectSystemMessageOption(function(optionData, next) {
      if (optionData.id !== systemMessageEscalationID) {
          return next(optionData);
      }else{
        if (optionData.option.value == "yes") {
          checkAgents().then(function(result) {
            if (result.agentsAvailable) {
              chatBot.actions.sendMessage(sendEscalateForm);
              return;
            }else {
              if (result.hasOwnProperty('reason')) {
                if(typeof result.reason=='string' && noAgentsAvailable.action == "displayChatbotMessage"){
                  chatBot.actions.displayChatbotMessage({type:'answer',message:result.reason,translate:true});
                  return;
                }
              }
              if(noAgentsAvailable.action == "intentMatch"){
                chatBot.actions.sendMessage({message:noAgentsAvailable.value});
              }else if (noAgentsAvailable.action == "displayChatbotMessage"){
                chatBot.actions.displayChatbotMessage({type:'answer',message:noAgentsAvailable.value});
              }
              return;
            }
          });
        }else{
          if (rejectedEscalation.action =='intentMatch') {
            chatBot.actions.sendMessage({message:rejectedEscalation.value});
          }else if (rejectedEscalation.action =='displayChatbotMessage'){
            chatBot.actions.displayChatbotMessage({type:'answer',message:rejectedEscalation.value});
          }

        }
        chatBot.actions.enableInput();
      }
    });
 };
}

/**
 * Validate the escalateConditions in order to reject if it hasn't been properly set.
 * @param  {[Object]} evaluatedObject Object escalateCondition to be evaluated
 * @return {[Boolean]}                 [boolean to check if it has bene correctly set]
 */
function validateEscalateConditions(evaluatedObject){
  if(typeof evaluatedObject == 'object'){
    if (evaluatedObject.hasOwnProperty('action') && evaluatedObject.hasOwnProperty('value')) {
      return true;
    }else{
    console.error('Escalate conditions must have action and value parameters.');
    return false;
    }
  }else {
    console.error('Escalate conditions must be an object');
    return false;
  }
}
window.launchNLEsclationForm = launchNLEsclationForm;