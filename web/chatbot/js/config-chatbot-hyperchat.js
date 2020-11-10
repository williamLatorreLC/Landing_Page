function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var res = "test";

    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            res = pair[1];
            break;
        }
    }

    res = decodeURIComponent(res);
    res = decodeURI(res);

    return res;
}

var nombre,apellido,staff,organizacion,depto,titulo,mail,id,perfilstatus,usuarioid,site,nomred;
var nombre = getQueryVariable("First_Name");
var apellido = getQueryVariable("Last_Name");
var perfilstatus = getQueryVariable("Profile_Status");
var staff = getQueryVariable("Support_Staff");
var organizacion = getQueryVariable("Organization");
var depto = getQueryVariable("Departament");
var titulo = getQueryVariable("Job_Title");
var mail = getQueryVariable("Internet_Email");
var usuarioid = getQueryVariable("User_ID");
var site = getQueryVariable("Site");
//Referencia de ID creado en backstage
var perfil_contenido = getQueryVariable("ProfileId");
var perfil_inbenta = parseInt(perfil_contenido, 10);
var avatar_name = "Anita";
var username = nombre+" "+apellido;
var datospersonales = "Nombre: "+nombre+" "+apellido+" | Tipo de usuario: "+staff+" | Estado de usuario: "+perfilstatus+" | Dirección Área: "+organizacion+" | Gerencia: "+depto+" | Cargo: "+titulo+" | Usuario Red: "+usuarioid+" | Correo: "+mail+" | Perfil Contenido: "+perfil_contenido+" | Ubicación: "+site; // Variable con todos los datos
var intentos = 1; //Número de intentos antes de contactar asesor
var nomred = nombre+" "+usuarioid;

// Inicializa el chatbot
function initChatbot(type){

    var surveyID = 7;

    var DomainKey = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9qZWN0IjoiY2xhcm9fY29fc2VydmljaW9zSVRfY2hhdGJvdF9lcyIsImRvbWFpbl9rZXlfaWQiOiJCWEZNNXhqZV9aSFZGRU0yaG4wMnN3OjoifQ.YDNhj2vByXsv6VShdUNndzWRwMape77ZRNqV3_9zMbb_3NUMo7-lsOQKdAEILoUVCvRnV78bzEjD_HOC3O-i3A';
	
    var ApiKey = 'LDjoN3GfFSUEt1LixzSLOYFx78IY6/RrQcRWoQa5Z4I=';

    //Rejected escalation will display What else can I do for you? as a chatbotMessage
    var rejectedEscalation={
        action:'displayChatbotMessage',
        value:'¿Que más puedo hacer por ti?'
    };

    //NoAgentsAvailable: requiere crear un contenido en el KNOWLEDGE del chatbot con este mismo titulo con una respuesta personalizada
    //https://help.inbenta.io/creating-required-contents-for-live-chat-escalation/
    var noAgentsAvailable={ action : 'intentMatch',
        value  : 'NoAgentsAvailable' }

    //Configuracion HyperChat
    SDKHCAdapter.configure({ appId            : 'BkPqCzngX',
        importBotHistory : true,
        region           : 'us',
        lang             : 'es',
        fileUploadsActive: true,
        room             : function () {
            return '1';//cola de chat
        },
        surveys          : { id: 7 }
    });



// Configuracion inicial para Chatbot
    var config = {
        //INFORMACION DEL USUARIO EN URL
        tracking:{
            userInfo:{
                UsuarioClaroCo:datospersonales
            }
        },
        //INFORMACION DEL USUARIO EN URL
        lang: 'es',
        answers: {
            answerAttributes: ['ANSWER_TEXT'],
            sideBubbleAttributes: ['SIDEBUBBLE_TEXT'],
			maxOptions:3, //NUMERO DE OPCIONES A MOSTRAR
        },
        closeButton:{
            visible:true
        },
        html : {
            'custom-window-header':
                '<div></div>'
        },
        userType: perfil_inbenta,
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
            gestionaRespuesta,
            addVariablesCol(),
            stringManipulate, //llama la funcion para cambiar el texto de bienvenida del chatbot
            openWindow, //acciones onReady
            SDKlaunchNLEsclationForm(SDKHCAdapter.checkEscalationConditions,'ChatWithLiveAgentContactForm',rejectedEscalation, noAgentsAvailable, intentos),
            SDKHCAdapter.build(), // IMPORTANTE: requiere crear un contenido en el KNOWLEDGE del chatbot con nombre 'ChatWithLiveAgentContactForm' con una respuesta personalizada, posteriormente crear un FORM dentro del contenido creado con los campos requeridos. (USUARIO_RED, FIRST_NAME, EMAIL_ADDRESS, etc.)
            //https://help.inbenta.io/creating-required-contents-for-live-chat-escalation/
            showSurvey(surveyID)

        ],

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
        },
        sanitizerOptions  : { allowedTags       : ['h1','h2','h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong',
                'em', 'strike', 'code', 'hr', 'br', 'div', 'form', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
                'img', 'iframe', 'small', 'center', 'label', 'input', 'span', 'button', 'select', 'optgroup', 'option', 'sup'],
            allowedAttributes : { a        : [ 'href', 'id', 'class', 'name', 'target', 'data-id', 'data-accion', 'onclick'],
                iframe   : ['src', 'frameborder', 'allow'],
                img      : [ 'src' ],
                div      : ['id', 'class'],
                table    : ['class'],
                input    : ['type', 'name', 'id', 'autocomplete'],
                button   : ['data-type', 'id', 'type', 'onclick', 'class', 'style'],
                ul       : ['class'],
                li       : ['style'],
                i        : ['class'],
                form     : ['id', 'method'],
                label    : ['for'],
                small    : ['class'],
                input    : ['type', 'value', 'name', 'id', 'class', 'data-requerido', 'autocomplete'],
                span     : ['class'],
                strong   : ['class'],
                select   : ['name', 'id', 'class', 'data-datos'],
                optgroup : ['label'],
                option   : ['value'] }
        }
    };
    var InbentaAuth = InbentaChatbotSDK.createFromDomainKey(DomainKey,ApiKey);
    ChatbotSDK = InbentaChatbotSDK.build(InbentaAuth, config);
}


// funcion para cambiar el texto de bienvenida del chatbot
function stringManipulate(chatBot) {
    var patt = new RegExp("{*}");
    let originalString = 'Hola, ¿en qué te puedo ayudar?';
    let newString = "Hola "+username+" soy "+avatar_name+", tu asistente virtual, ¿En qué puedo ayudarte?.";

    var chatBot_action = chatBot;
    var usuario_red = usuarioid;

    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        var res = patt.test(messageData.message);

        if(res) {
            messageData.message = messageData.message.replace('{username}', username);
            messageData.message = messageData.message.replace('{avatar_name}', avatar_name);
        } else if (messageData.message == originalString) {
            messageData.message = newString;
        }

        switch(messageData.message){

            case "usuario_red":
                next = false;

                chatBot_action.actions.sendMessage({message: usuario_red});

                break;

        }

        if(next){
            return next(messageData);
        } else {
            //nada
        }

    });
}

//funcion para pasar variable

   function addVariablesCol(){
    return function(chatBot){
		chatbot = chatBot;
    chatBot.subscriptions.onDisplaySystemMessage(function(messageData, next){
		console.log('escalate', messageData);
        if(messageData.message === "escalate-chat") {
          chatBot.api.addVariable('FIRST_NAME', nomred).then(function(){
            chatBot.api.addVariable('EMAIL_ADDRESS', mail)
          });
          
        } 
        return next(messageData);         
    });
    } 

  } 

// accciones onReady-------------------------------------------------->

function openWindow(chatBot){
    chatBot.subscriptions.onReady(function(next) {
        //chatBot.actions.resetSession();
        chatBot.actions.showConversationWindow();
    });

    var patt = new RegExp("{*}");
    let originalString = 'Hola, ¿en qué te puedo ayudar?';
    let newString = "Hola "+username+" soy "+avatar_name+", tu asistente virtual, ¿En qué puedo ayudarte?.";

    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        var res = patt.test(messageData.message);

        if(res) {
            messageData.message = messageData.message.replace('{username}', username);
            messageData.message = messageData.message.replace('{avatar_name}', avatar_name);
        } else if (messageData.message == originalString) {
            messageData.message = newString;
        }

        return next(messageData);
    });
}

// Funcion para cambiar los textos de NO RESPUESTA para enviar al Chat en vivo
function noRespuesta(chatBot) {
    var urlChat = "#";

    //mensajes originales
    let originalMsg_1 = 'Lo siento, no he podido encontrar información relacionada con tu pregunta. Por favor, inténtalo de nuevo con otras palabras.';

    let originalMsg_2 = 'He mirado y no encuentro nada que responda a tu pregunta. Por favor, realiza una nueva búsqueda usando otras palabras.';

    let originalMsg_3 = 'Lo siento, no he podido encontrar respuestas para tu duda.';

    let originalMsg_4 = 'Creo que ninguna de las opciones que he encontrado te pueden ayudar. Por favor, escribe otra frase o palabra.';

    //mensajes que reemplazan los originales
    let newMsg_1 = "No he podido encontrar información relacionada con tu pregunta, Por favor, escribe otra frase o palabra.";

    let newMsg_2 = "Creo que ninguna de las opciones que he encontrado te pueden ayudar, Por favor, escribe otra frase o palabra.";

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
                i=0;//resetea valor para volver a aplicar el evento en otro flujo de conversación
                const chatBotmessageData = {
                    type: 'answer',
                    message: newMsg_2,
                }

                return next(messageData) + next(chatBot.actions.displayChatbotMessage(chatBotmessageData));
            }
            messageData.message = "No";
            return next(messageData);
        }
    });
}

function gestionaRespuesta(chatBot) {
    xchatBot = chatBot;
    tratamiento.imgModal();

    chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        let originalString = 'Hola {nombre} soy Anita, tu asistente virtual, ¿en qué puedo ayudarte?';
        var mensaje = messageData;
        
        try {
            
            var datos = JSON.parse(messageData.message);
            messageData.message = tratamiento.consulta(datos);
        }catch (e) {
            messageData = mensaje;
        }

        setTimeout(function() { tratamiento.imgModal(); }, 300);
        return next(messageData);
    });
}

var tratamiento = (function (window, undefined) {

    var consulta = function(datos){
        var titulo = '';
        var cons = '';
        try {

            switch(datos.metodo){
                case 'incidente':
                    titulo = 'Consulta Incidente';
                    cons += '<div style="max-width:304px;">'+
                            '<div><strong>Descripción del incidente:<strong><br/><br/></div> ';

                        cons += '<div><strong>No de Incidente:</strong>  ' + datos.datos.no_incidente + ' </div> ' +
                        '<div><strong>Estado del Incidente:</strong> ' + datos.datos.estatus + ' </div>' +
                        '<div><strong>Descripción del Incidente:</strong> '+ datos.datos.descripcion_incidente + '</div>' +
                        '<div><strong>Fecha de Creación:</strong> '+ datos.datos.fecha_creacion + ' </div>' +
                        '<div><strong>Descripción detallada:</strong> '+ datos.datos.descripcion_detallada + ' </div>' +
                        '<br/><hr/>' +
                        '<div><strong>Notas del incidente:</strong><br/></div>';

                    for (var i = 0; i < datos.datos.notas.length; i++) {
                        cons += '<br/><div><strong>Fecha de la nota:</strong> ' + datos.datos.notas[i].fecha_nota + ' </div> ' +
                            '<div><strong>Información:</strong> '+ datos.datos.notas[i].descripcion_nota + ' </div> ';
                    }

                    cons += '<br/><hr/>';

                    cons += '<div><strong>Solución del Incidente:</strong><br/><br/></div>'+
                            '<div><strong>Fecha de Solución:</strong> '+ datos.datos.fecha_solucion + ' </div>' +
                            '<div><strong>Solución del Incidente:</strong> ' + datos.datos.solucion + '</div>';
                    
                    cons += '</div>';
                    break;

                case 'ordentrabajo':
                    titulo = 'Consulta de Solicitudes';

                    cons += '<div style="max-width:304px;">'+
                        '<div><strong>Descripción de la Orden de Trabajo:<strong><br/><br/></div> ';

                        cons += '<div><strong>No de Solicitud:</strong>  ' + datos.datos.no_incidente + ' </div> ' +
                        '<div><strong>Estado de la Solicitud:</strong> ' + datos.datos.estatus + ' </div>' +
                        '<div><strong>Descripción de la solicitud:</strong> '+ datos.datos.descripcion_incidente + ' </div>' +
                        '<div><strong>Fecha de Creación:</strong> '+ datos.datos.fecha_creacion + ' </div>' +
                        '<div><strong>Descripción detallada:</strong> '+ datos.datos.descripcion_detallada + ' </div>' +
                        '<br/><hr/>' +
                        '<div><strong>Notas de la Orden de Trabajo:</strong><br/></div>';

                    for (var i = 0; i < datos.datos.notas.length; i++) {
                        cons += '<br/><div><strong>Fecha de la nota:</strong> ' + datos.datos.notas[i].fecha_nota + ' </div> ' +
                            '<div><strong>Información:</strong> '+ datos.datos.notas[i].descripcion_nota + ' </div> ';
                    }

                    cons += '<br/><hr/>';

                    cons += '<div><strong>Solución de la Orden de trabajo:</strong><br/><br/></div>'+
                            '<div><strong>Fecha de Solución:</strong> '+ datos.datos.fecha_solucion + ' </div>' +
                            '<div><strong>Solución de la Orden de trabajo:</strong> ' + datos.datos.solucion + '</div>';
                    
                    cons += '</div>';

                    break;

                case 'requerimiento':
                    titulo = 'Consulta de Requerimiento';

                    cons += '<div style="max-width:304px;">'+
                        '<div><strong>Descripción del Requerimiento:<strong><br/><br/></div> ';

                    cons += '<div><strong>No del Requerimiento:</strong>  ' + datos.datos.no_requerimiento + ' </div> ' +
                        '<div><strong>No de Incidente /Solicitud:</strong> ' + datos.datos.no_caso + ' </div>' +
                        '<div><strong>Estado:</strong> '+ datos.datos.estatus + ' </div>' +
                        '<div><strong>Descripción del Requerimiento:</strong> '+ datos.datos.descripcion + ' </div>' +
                        '<div><strong>Fecha del Requerimiento:</strong> ' + datos.datos.caso.fecha_creacion + ' </div>';

                    cons += '<br/>';

                    cons += '<div><strong>Descripción del Incidente / Solicitud:<strong><br/><br/></div>'+
                    '<div><strong>No de Incidente:</strong>  ' + datos.datos.caso.no_incidente + ' </div> ' +
                    '<div><strong>Estado del Incidente:</strong> ' + datos.datos.caso.estatus + ' </div>' +
                    '<div><strong>Descripción del Incidente:</strong> '+ datos.datos.caso.descripcion_incidente + ' </div>' +
                    '<div><strong>Fecha de Creación:</strong> '+ datos.datos.caso.fecha_creacion + ' </div>' +
                    '<div><strong>Descripción detallada:</strong> '+ datos.datos.caso.descripcion_detallada + ' </div>';

                    cons += '<br/><hr/>';
                    cons += '<div><strong>Notas del Incidente / Solicitud:</strong><br/></div>';

                    for (var i = 0; i < datos.datos.caso.notas.length; i++) {
                        cons += '<br/><div><strong>Fecha de la Nota:</strong> ' + datos.datos.caso.notas[i].fecha_nota + ' </div> ' +
                            '<div><strong>Información:</strong> '+ datos.datos.caso.notas[i].descripcion_nota + ' </div> ';
                    }

                    cons += '<br/><hr/>';

                    cons += '<div><strong>Solución del Incidente / Solicitud:</strong><br/><br/></div>'+
                            '<div><strong>Fecha de Solución:</strong> '+ datos.datos.caso.fecha_solucion + ' </div>' +
                            '<div><strong>Solución del Incidente / Solicitud:</strong> ' + datos.datos.caso.solucion + '</div>';
                    
                    cons += '</div>';

                    break;

                case 'historial':
                    titulo = 'Historial';
                    cons += '<div><div><strong>Historial de Casos</strong></div>';

                    for (var i = 0; i < datos.datos.notas.length; i++) {

                        if(datos.datos.notas[i].no_requerimiento != null) {
                            cons += '<div>No de Requerimiento: ' + datos.datos.notas[i].no_requerimiento + ' </div> ';
                        }
                        if(datos.datos.notas[i].no_caso != null) {
                            cons += '<div>No de Incidente /Solicitud: ' + datos.datos.notas[i].no_caso + ' </div> ';
                        }

                        cons += '<div>Estado: ' + datos.datos.notas[i].estatus + ' </div> ' +
                                '<div>Resumen del Caso: ' + datos.datos.notas[i].resumen_caso + ' </div> ' +
                                '<div>Fecha de creación: '+ datos.datos.notas[i].fecha_creacion + ' </div> ' +
                                '<br/><hr>';

                    }
                    break;

                default:
                    break;
            }

            cons += '</div>';


            var contenido = {
                sideWindowTitle: titulo,
                sideWindowContent: cons
            };

            xchatBot.actions.showSideWindow(contenido);
        }catch (e) {

            return 'Lo siento, no he podido encontrar respuestas para tu duda.';
        }
        return 'Mira lo que tenemos para ti';
    }

    var imgModal = function() {
        //$('a.maximizar').fancybox();
    };

    return {
        imgModal : function() {
            imgModal();
        },
        consulta : function (datos) {
            return consulta(datos);
        }
    };

})(window, undefined);


initChatbot('token');
