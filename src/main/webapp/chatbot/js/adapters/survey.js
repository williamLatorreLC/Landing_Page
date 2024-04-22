//Version 1.2 Febero 10 2022 This adapter shows a previously-created survey from the same project as the domain/secret key Chatbot SDK. When a user clicks on the "Close" button of the conversation window, the confirmation message appears. If they confirm that you want to leave the conversation, the survey then appears in the conversation window.

function showSurvey(surveyID) {
  var surveyProcess='toInit';
  return function(chatbot){
    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
      if (event.data.message == "inbenta.survey.successful_answer") {
        surveyProcess='Finished';
          //
          console.log("resetea Sesión cuando se termina de contestar la encuesta")
        //chatbot.actions.resetSession();
      }
    }
    chatbot.subscriptions.onResetSession(function(next) {
      if(surveyProcess!=='toInit'){
        surveyProcess='toInit';
        return next();
      }else {
          //
          console.log("lanza encuesta...");

        var surveyURL = chatbot.api.getSurvey(surveyID);
        surveyURL.then(({data})=>{
          var survey={
            content: '<iframe name="inbenta-survey" src=' + data.url + '></iframe>'
          }
          chatbot.actions.showCustomConversationWindow(survey);
          surveyProcess = 'inProgress';
        })
      }
    })
    chatbot.subscriptions.onDisplaySystemMessage(function(messageData,next) {

      if(messageData.id="exitConversation"){
        if(surveyProcess=='inProgress'){
          surveyProcess = 'Finished';
            //
            console.log("resetea Sesión al cerrar ventana cuando la encuesta aun está incompleta");
          //chatbot.actions.resetSession();
        }else {
          return next(messageData)
        }
      }
//



    })
  }
}
window.showSurvey = showSurvey;
