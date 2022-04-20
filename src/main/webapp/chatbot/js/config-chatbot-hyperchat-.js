var avatar_name = "MaTIlda";
var username = "Diego Rivera";
var perfil_contenido = 1; //ID del perfil de contenido creado en Backstage

// Inicializa el chatbot
function initChatbot(type){
    
    var surveyID = 1;
    
    var DomainKey = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9qZWN0IjoiY2xhcm9fY29fc2VydmljaW9zSVRfY2hhdGJvdF9lcyIsImRvbWFpbl9rZXlfaWQiOiJCVzVsVFFDd3Y0ODlpWmRua2lwM0p3OjoifQ.OGp-xTI0cPojEhlXi3WTB87ZcrSsrJNFhD_-UanvsV4NUInB6HQ6EqhVFp3Xiwt2xsNWTfSD3_lOVJHpAB_58Q';
    
    var ApiKey = 'LDjoN3GfFSUEt1LixzSLOYFx78IY6/RrQcRWoQa5Z4I=';

  //Rejected escalation will display What else can I do for you? as a chatbotMessage
  var rejectedEscalation={
    action:'displayChatbotMessage',
    value:'¿Que más puedo hacer por ti?'
  };

  //NoAgentsAvailable: requiere crear un contenido en el KNOWLEDGE del chatbot con este mismo titulo con una respuesta personalizada
    //https://help.inbenta.io/creating-required-contents-for-live-chat-escalation/
  var noAgentsAvailable={
    action:'intentMatch',
    value:'NoAgentsAvailable'
  }

    //Configuracion HyperChat
    SDKHCAdapter.configure({
        appId: 'BkPqCzngX',
        importBotHistory: true,
        region: 'us',
        lang: 'es',
        room: function () {
            return '1';//cola de chat
        }
    });

    

// Configuracion inicial para Chatbot
var config = {
    lang: 'es',
    answers: {
        answerAttributes: ['ANSWER_TEXT'],
        sideBubbleAttributes: ['SIDEBUBBLE_TEXT'],
    },
    closeButton:{
        visible:true
    },
    html : {
    'custom-window-header':
        '<div></div>'
      },
    userType: perfil_contenido,
    chatbotId: 'claro_col_chatbot_web',
    showRatingWithinMessages: true,
    ratingOptions: [{
            id: 1,
            label: 'Si',
            comment: false
        },
        {
            id: 2,
            label: 'No',
            comment: true
        }
    ],
    environment: "production",
    launcher: {
        title: ""
    },
    adapters: [ 
        noRespuesta,
        stringManipulate, //llama la funcion para cambiar el texto de bienvenida del chatbot
        openWindow, //acciones onReady
        SDKlaunchNLEsclationForm(SDKHCAdapter.checkEscalationConditions,'ChatWithLiveAgentContactForm',rejectedEscalation, noAgentsAvailable, 1),

        SDKHCAdapter.build(), // IMPORTANTE: requiere crear un contenido en el KNOWLEDGE del chatbot con nombre 'ChatWithLiveAgentContactForm' con una respuesta personalizada, posteriormente crear un FORM dentro del contenido creado con los campos requeridos. (USUARIO_RED, FIRST_NAME, EMAIL_ADDRESS, etc.)
        //https://help.inbenta.io/creating-required-contents-for-live-chat-escalation/
        showSurvey(surveyID)
        
    ],
    sanitizerOptions : {
        allowedTags: ['iframe'],
        allowedAttributes: {
          a: [ 'href', 'name', 'target' ],
          iframe:['src','width','height','allow','frameborder'],
          img: [ 'src' ]
        }
      },
    labels: {
        es: {
            'yes': 'Si',
            'no': 'No',
            'escalate-chat' : '¿Quieres comunicarte con un asesor?',
            'generic-error-message': 'Por favor intente con otra pregunta',
            'enter-question': 'Pregunta aquí',
            'interface-title': 'MyIT',//titulo del header del Chatbot
            'guest-name': 'Tu',
            'help-question': '¿Cómo te puedo ayudar?',
            'thanks': 'Gracias!',
            'rate-content': '¿Esto te ha sido útil?',
            'form-message': 'Por favor dinos por que',
            'submit': 'Enviar',
            'alert-title' : 'OOOOPS...!',
            'alert-message' : 'Algo salió mal, por favor intenta de nuevo.',
            'alert-button' : 'Intenta de nuevo',
            'agent-joined' : '{agentName} se ha unido al chat',
            'agent-left' : '{agentName} ha dejado el chat',
            'wait-for-agent' : 'Esperando por un agente...',
            'no-agents' : 'No hay agentes disponibiles',
            'close-chat' : '¿Quieres cerrar el chat?',
            'chat-closed' : 'Chat cerrado',
            'download' : 'Descargar',
            'agent-typing': '{agentName} está escribiendo',
            'agents-typing': '{agentName} y {agentName2}  estan escribiendo',
            'several-typing': 'Varias personas están escribiendo'
        }
    },
    avatar: {
        name: avatar_name,// el nombre del AVATAR
        shouldUse: true, // only set to true if you have avatar videos to show
        videos: {
            enter: [
                'https://static-or01.inbenta.com/49974c4abf8377d0900f49cc37a6b6089eae4bbf30887e36c5ce35ee9e68416b/LauraVideos/va_idle_04.mp4'
            ],
            // Laura does not enter/exit on live site
            // video link played when avatar is waiting a user action
            idle: [
                'https://static-or01.inbenta.com/49974c4abf8377d0900f49cc37a6b6089eae4bbf30887e36c5ce35ee9e68416b/LauraVideos/va_idle_04.mp4'
            ],
            // video link played when avatar say something
            speak: [
                'https://static-or01.inbenta.com/49974c4abf8377d0900f49cc37a6b6089eae4bbf30887e36c5ce35ee9e68416b/LauraVideos/va_idle_04.mp4'
            ]
        },
        // Image to be shown for incompatible browsers
        // Note to self: find fallbackImage URL
        fallbackImage: ''
    }
};
    var InbentaAuth = InbentaChatbotSDK.createFromDomainKey(DomainKey,ApiKey);
    ChatbotSDK = InbentaChatbotSDK.build(InbentaAuth, config);
}


// funcion para cambiar el texto de bienvenida del chatbot
function stringManipulate(chatBot) {
  let originalString = 'Hola, ¿en qué te puedo ayudar?';
  let newString = "Hola "+username+" soy "+avatar_name+", tu asistente virtual, ¿en qué puedo ayudarte?.";

    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        if (messageData.message !== originalString) {
            return next(messageData)
        } else {
            messageData.message = newString;
            return next(messageData);
        }
        
         
    });
}

// accciones onReady--------------------------------------------------> 
          
function openWindow(chatBot){
    // FOR TESTING....
       chatBot.subscriptions.onReady(function(next) {
           //borra la lista de conversaciones previas (sesión) cada vez que se carga el chat
           //chatBot.actions.resetSession(); 
           //console.log("borra sesión al cargar..");
           
           //abre la ventana de conversación automaticamente, sin necesidad del launcher...
           //chatBot.actions.showConversationWindow();
           //console.log("lanza ventana sin laucher..");
        });    
}

// Funcion para cambiar los textos de NO RESPUESTA y enviar al HYPERCHAT--------------->
function noRespuesta(chatBot) {
          var urlChat = "";
          
          //mensajes originales
          let originalMsg_1 = 'Lo siento, no he podido encontrar información relacionada con tu pregunta. Por favor, inténtalo de nuevo con otras palabras.';
          
          let originalMsg_2 = 'He mirado y no encuentro nada que responda a tu pregunta. Por favor, realiza una nueva búsqueda usando otras palabras.';
          
          let originalMsg_3 = 'Lo siento, no he podido encontrar respuestas para tu duda.';
          
          let originalMsg_4 = 'Creo que ninguna de las opciones que he encontrado te pueden ayudar. Por favor, escribe otra frase o palabra.';
          
          //mensajes que reemplazan los originales
          let newMsg_1 = "No he podido encontrar información relacionada con tu pregunta, ¿quieres hablar con un asesor?";
          
          let newMsg_2 = "Creo que ninguna de las opciones que he encontrado te pueden ayudar, ¿quieres hablar con un asesor?";

          //cuando no hay respuesta encontrada
          // 1)
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_1) {
              return next(messageData)
            } 
              else {
              messageData.message = newMsg_1;     
              return next(messageData);
            }         
          });
          // 2) -------------------------------------------------->
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_2) {
              return next(messageData)
            } 
              else {
              messageData.message = newMsg_1;     
              return next(messageData);
            }         
          });
          // 3)-------------------------------------------------->
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_3) {
              return next(messageData)
            } 
              else {
              messageData.message = newMsg_1;     
              return next(messageData);
            }         
          });
          
          //cuando el chatbot muestra respuestas pero el usuario ha indicado "NO" a las respuestas ofrecidas-------------------------------------------------->
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_4) {
              return next(messageData)
            } 
              else {
              messageData.message = newMsg_2;     
              return next(messageData);
            }         
          });
          
          //contar los "NO" para enviar a chat en vivo....-------------------------------------------------->
          var i = 0;
          chatBot.subscriptions.onDisplayUserMessage(function(messageData, next) {
              if (messageData.message !== "No") {
                  return next(messageData);
              }
              else {
                  
                  //cuenta cuantos "NO" antes de enviar al chat en vivo
                  i++;
                  if(i>=2){
                      
                      console.log("Ya son 2 'NO' ---> i= "+i);
                      //resetea valor para volver a aplicar el evento en otro flujo de conversación
//                      const chatBotmessageData = {
//                          type: 'answer',
//                          message: newMsg_2,
//                        }
                       
                       //return next(messageData) + next(chatBot.actions.displayChatbotMessage(chatBotmessageData));
                      
                      var escalateSystemMessageData={
                        message: 'escalate-chat',
                        translate: true,
                        options: [
                            {label: 'yes',value:'yes'},
                            {label: 'no', value:'no'}
                          ]
                      };
                      
                    //var systemMessageEscalationID = chatBot.actions.displaySystemMessage(escalateSystemMessageData);
                    chatBot.actions.disableInput();
                    chatBot.actions.escalateToAgent();
                    i=0;
                    //return next(systemMessageEscalationID)+next(messageData);
                    return next(messageData) + next(chatBot.actions.displaySystemMessage(escalateSystemMessageData));
                    
                      
                  }
                   messageData.message = "No"; 
                   return next(messageData);
                  
                }     
            }); 
    
          
}


initChatbot('token');
