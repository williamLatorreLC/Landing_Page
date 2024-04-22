//Version 8 Generada el 10 de Febrero 2022
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

function decryptData(encryptedData = ''){

    var secretkey = 'LandingMyITPageK';
    var decryptedData = '';

    try {
      var rawData = CryptoJS.enc.Base64.parse(encryptedData);
      var key = CryptoJS.enc.Latin1.parse(secretkey);
      var decryptedBytes = CryptoJS.AES.decrypt({ ciphertext: rawData }, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
      var decryptedData = decryptedBytes.toString(CryptoJS.enc.Latin1);
    } catch (e) {
      console.log('Excepcion al intentar obtener información desde X_MYIT_INFO');
      console.log(e);
    }

    return decryptedData;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
}

function getSessionVariable(variable) {
    var value         = 'test';
    var data          = '';
    var encryptedData = sessionStorage.getItem("X_MYIT_INFO");

    if(encryptedData !== null){
        data = decryptData(encryptedData);

        if(IsJsonString(data)){
            var obj = JSON.parse(data);

            if(obj[variable] !== undefined){
                switch(variable){
                    case 'User':
                        value = decryptData(obj[variable]);
                    break;
                    default:
                        value = obj[variable];
                    break;
                }
            } else {
                console.log('No se encontro la variable '+variable+' en X_MYIT_INFO. Se inicializará la variable con valor default');
            }
        } else {
          console.log('No se obtuvo un JSON desde X_MYIT_INFO. Se inicializará la variable chatbot con valores default');
        }

    } else {
      console.log("Informacion de sesion X_MYIT_INFO no encontrada se inicializará el chatbot con valores default. " + variable);
    }

    return value;
}

var nombre,apellido,staff,organizacion,depto,titulo,mail,id,perfilstatus,usuarioid,site,nomred;
var nombre = getSessionVariable("First_Name");
var apellido = getSessionVariable("Last_Name");
var perfilstatus = getSessionVariable("Profile_Status");
var staff = getSessionVariable("Support_Staff");
var organizacion = getSessionVariable("Organization");
var depto = getSessionVariable("Departament");
var titulo = getSessionVariable("Job_Title");
var mail = getSessionVariable("Internet_Email");
var usuarioid = getSessionVariable("User_ID");
var site = getSessionVariable("Site");
//Referencia de ID creado en backstage
var perfil_contenido = getSessionVariable("ProfileId");
var perfil_inbenta = parseInt(perfil_contenido, 10);
var avatar_name = "Anita";
var username = nombre+" "+apellido;
var datospersonales = "Nombre: "+nombre+" "+apellido+" | Tipo de usuario: "+staff+" | Estado de usuario: "+perfilstatus+" | Dirección Área: "+organizacion+" | Gerencia: "+depto+" | Cargo: "+titulo+" | Usuario Red: "+usuarioid+" | Correo: "+mail+" | Perfil Contenido: "+perfil_contenido+" | Ubicación: "+site; // Variable con todos los datos
var intentos = 1; //Número de intentos antes de contactar asesor
//Variables de consulta y creacion de casos, y de revision de redes
var nomred = nombre+" "+usuarioid;
var var_clr_id = '';
var var_customer_type = '';
var var_site = '';
var var_numero_caso = '';
var var_archivo = '';
var var_nombre_archivo = '';
var xchatbot = null;
var var_tipoDiagnostico = '';
var var_cavSeleccionado = '';
var var_ipDiagnosticar = '';

var var_org = '';
var var_dep = '';
var var_release_support_response = '';

var var_impact = '';
var var_urgency = '';
var var_extra_info = '';

var var_isIncident = false;

var var_adjuntar_archivo_nota = false;
var var_flujo_felicitacion = false;

var categoriesTries = 1;

var customEscalateForm = '';
var lastCustomEscalateForm = '';

var userIsActive = true;
var userNotifications = 0;
var originalDocumentTitle = document.title;

// Inicializa el chatbot
function initChatbot(type){

    var surveyID = 7;

	  //var DomainKey = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9qZWN0IjoiY2xhcm9fY29fc2VydmljaW9zSVRfY2hhdGJvdF9lcyIsImRvbWFpbl9rZXlfaWQiOiJCVzVsVFFDd3Y0ODlpWmRua2lwM0p3OjoifQ.OGp-xTI0cPojEhlXi3WTB87ZcrSsrJNFhD_-UanvsV4NUInB6HQ6EqhVFp3Xiwt2xsNWTfSD3_lOVJHpAB_58Q';
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
    SDKHCAdapter.configure({ appId: 'BkPqCzngX',
        importBotHistory : true,
        region           : 'us',
        lang             : 'es',
        fileUploadsActive: true,
        room: function () {
            return '1';//cola de chat 1: Soporte | 2: Pruebas
        },
        surveys   : { id: 7 },
		    transcript: { download: true },
    });



// Configuracion inicial para Chatbot
    var config = {
        showDateTime: true,
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
            'custom-window-header':'<div></div>',
            'conversation-window-footer':'<conversation-window-footer-form><svg id="inbenta-bot-home-btn" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" class="home-btn inbenta-bot-icon home-click"><circle cx="16" cy="16" r="15.5" stroke="#da262c" class="home-click"></circle><path d="m26.184 14.836-9.057-9.052-.607-.607a.739.739 0 0 0-1.04 0l-9.664 9.659a1.497 1.497 0 0 0-.44 1.078c.01.825.696 1.484 1.52 1.484h.997v7.633h16.214v-7.633h1.017c.401 0 .778-.157 1.062-.441a1.49 1.49 0 0 0 .438-1.062c0-.398-.157-.775-.44-1.06Zm-8.872 8.508h-2.625v-4.782h2.626v4.782Zm5.108-7.634v7.634h-3.608V18a.937.937 0 0 0-.937-.938h-3.75a.937.937 0 0 0-.938.938v5.344H9.582V15.71H7.33l8.671-8.665.542.542 8.128 8.123H22.42Z" fill="#da262c" class="home-click"></path></svg><upload-media-button /><chatbot-input /><character-counter /><send-button /></conversation-window-footer-form>'
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
            CLAROlaunchNLEsclationForm(SDKHCAdapter.checkEscalationConditions,'ChatWithLiveAgentContactForm',rejectedEscalation, noAgentsAvailable, intentos),
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
                'several-typing': 'Varias personas están escribiendo',
				'queue-estimation-first': 'Pronto serás atendido'
            }
        },
        avatar: {
            name: avatar_name,// el nombre del AVATAR
            shouldUse: true, // only set to true if you have avatar videos to show
            videos: {
                enter: [
                    'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/Avatar/ENTRADA.mp4'
                ],
                // Laura does not enter/exit on live site
                // video link played when avatar is waiting a user action
                idle: [
                    'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/Avatar/HABLANDO.mp4'
                ],
                // video link played when avatar say something
                speak: [
                    'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/Avatar/SALIDA.mp4'
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
                div      : ['id', 'class','style'],
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
                select   : ['name', 'id', 'class', 'data-datos','onchange'],
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


//FUNCIONES DE CASOS Y CONECTIVIDAD

function setSite (site){

    if(site != null){

        var_site = site;

        var directMessageData = {
            message: site,
            directCall: 'show_customer_types', //seleccionado el site hay que solicitar tipo de usuario
        }

        xchatbot.actions.sendMessage(directMessageData).then(function(){

          const userMessageData = {
              message: 'Ubicación: ' + site,
          }

          xchatbot.actions.displayUserMessage(userMessageData);

        });
    }

}

function addNote (){

    if(var_numero_caso != null){

        var directMessageData = {
            message: 'Agregar nota',
            directCall: 'create_case_note',
        }

        xchatbot.actions.sendMessage(directMessageData);
    }

}

function setImpact (impact){

    if(impact && impact != null){

        var_impact = impact;

        if(var_impact && var_urgency){

            var directMessageData = {
                message: var_impact + '|' + var_urgency,
            }

			      //xchatbot.api.addVariable('IMPACT_URGENCY', var_impact + '|' + var_urgency);

            xchatbot.actions.sendMessage(directMessageData);
        }

    }
}

function setUrgency (urgency){

    if(urgency && urgency != null){

        var_urgency = urgency;

        if(var_impact && var_urgency){

            var directMessageData = {
                message: var_impact + '|' + var_urgency,
            }

			      //xchatbot.api.addVariable('IMPACT_URGENCY', var_impact + '|' + var_urgency);

            xchatbot.actions.sendMessage(directMessageData);
        }

    }
}


function setDiagnosisType (diagnosis_type,texto){

    if(diagnosis_type != null){

        var_tipoDiagnostico = diagnosis_type;

        var directMessageData = {
            message: var_tipoDiagnostico,
            directCall: 'select_cav', //seleccionado sl tipo de cliente hay que solicitar las categorias
        }

		    //xchatbot.api.addVariable('DIAGNOSIS_TYPE', var_tipoDiagnostico);

        xchatbot.actions.sendMessage(directMessageData).then(function(){

          const userMessageData = {
              message: texto,
          }

          xchatbot.actions.displayUserMessage(userMessageData);

        });

    }
}

function setCavZone (cav_zone){

    if(cav_zone != null){

        var directMessageData = {
            message: cav_zone,
        }

        xchatbot.actions.sendMessage(directMessageData).then(function(){

          const userMessageData = {
              message: cav_zone,
          }

  		    //xchatbot.api.addVariable('CAV_ZONE', cav_zone);
          xchatbot.actions.displayUserMessage(userMessageData);

        });

    }
}


function setCustomerType (customer_type){

    if(site != null){

        var_customer_type = customer_type;

		    //xchatbot.api.addVariable('CUSTOMER_TYPE', var_customer_type);
        var directMessageData = {
            message: var_customer_type,
            directCall: 'show_categories', //seleccionado sl tipo de cliente hay que solicitar las categorias
        }

        if(var_flujo_felicitacion){

            var_clr_id = "18220";

            var directMessageData = {
                message: var_clr_id,
                directCall: 'show_instructions',
            }

        } else {

            //

        }

        xchatbot.actions.sendMessage(directMessageData);

    }
}

function setCategory (clr_id){

    if(site != null){

        var_clr_id = clr_id;

		    //xchatbot.api.addVariable('CLRID', var_clr_id);

          var directMessageData = {
              message: var_clr_id,
              directCall: 'show_instructions', //capturados los parametros hay que solicitar la scripción detallada
          }

          xchatbot.actions.sendMessage(directMessageData);

    }
}

//Flujo_Personalizacion_Diseño_Servicios
function setOrganization (org){

    if(org != null){

        var_org = org;

        var directMessageData = {
            message: org,
        }

		    //xchatbot.api.addVariable('REQUEST_ORGANIZATION', org); //FIXME probablemente no se necesita

        xchatbot.actions.sendMessage(directMessageData).then(function(){

          const userMessageData = {
              message: 'Área: ' + org,
          }

          xchatbot.actions.displayUserMessage(userMessageData);
        });

    }
}

//Flujo_Personalizacion_Diseño_Servicios
function setDepartment (dep){

    if(dep != null){

        var_dep = dep;

        var directMessageData = {
            message: dep,
        }

		    //xchatbot.api.addVariable('REQUEST_DEPENDENCY', dep); //FIXME probablemente no se necesita

        xchatbot.actions.sendMessage(directMessageData).then(function(){

          const userMessageData = {
              message: 'Gerencia: ' + dep,
          }

          xchatbot.actions.displayUserMessage(userMessageData);
        });

    }
}

//FUNCIONES DE CASOS Y CONECTIVIDAD


//funcion para pasar variable

   function addVariablesCol(){
    return function(chatBot){
		ychatbot = chatBot;

        chatBot.subscriptions.onDisplaySystemMessage(function(messageData, next){

            if(messageData.message === "escalate-chat") {
              ychatbot.api.addVariable('FIRST_NAME', nomred).then(function(){
                ychatbot.api.addVariable('EMAIL_ADDRESS', mail)
              });

            }

            if(messageData.message === "agent-joined" || messageData.message === "chat-closed") {

              userNotifications++;

              if(userIsActive){
                //user is here
                userNotifications = 0;
                document.title = originalDocumentTitle;
              } else {

                var txtNotifications = '(' + userNotifications + ') ';
                document.title = txtNotifications + originalDocumentTitle;
              }

              //audio para hablar con agente
              var audio = new Audio('https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/swiftly-610.mp3');
              audio.play();

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

        chatBot.helpers.setListener('.home-btn', 'click', function(){
          chatBot.actions.sendMessage({message: 'inicio'});
        });
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


function showSites(chatbot,un_sites){

    //se puede usar el api para obtener las variables generadas por el webhook para mostrar las cuentas del usuario
    //podría hacerse en el callback
    xchatbot = chatbot;
    var sitesMessage = 'Selecciona tu ubicación:<br/>';

    try {

        const sites = {};

        Object.keys(un_sites).sort().forEach(function(key) {
          sites[key] = un_sites[key];
        });

        var sitesSelect = '<select id="site" onchange="setSite(this.value)">';

        sitesSelect += "<option>--Selecciona--</option>";


        for (var site in sites) {

            if (sites.hasOwnProperty(site)) {
                sitesSelect += "<option value='"+site+"'>"+site+"</option>";
            }
        }

        sitesMessage += sitesSelect + '</select>';

        //se necesita poner para que se detecte cambio en el contenido y se pueda volver a generar el sidebubble
        sitesMessage += '<div style="display:none">'+Date.now()+'</div>';

        var contenido = {
            sideWindowTitle: 'Selecciona sitio',
            sideWindowContent: sitesMessage
        };

        xchatbot.actions.showSideWindow(contenido);

    } catch (e) {
        //
        console.log(e);
    }

};

function showCustomerTypes(chatbot,types){
    //se puede usar el api para obtener las variables generadas por el webhook para mostrar las cuentas del usuario
    //podría hacerse en el callback
    xchatbot = chatbot;
    var message = 'Selecciona el tipo de cliente:<br/>';

    try {

        var select = '<select id="customerType" onchange="setCustomerType(this.value)">';

        select += "<option>--Selecciona--</option>";
        for (var type in types) {
            if (types.hasOwnProperty(type)) {
                select += "<option value='"+type+"'>"+types[type]+"</option>";
            }
        }

        message += select + '</select>';

    } catch (e) {
        //mensaje ya es DEFAULT
    }

    return message;

};

//Flujo_Personalizacion_Diseño_Servicios
function showOrganizations(organizations){

    organizations = JSON.parse(organizations);

    var message = 'Area Solicitante:<br/>';

    try {

        var select = '<select id="organization" onchange="setOrganization(this.value)">';

        select += "<option>--Selecciona--</option>";
        for (var org in organizations.datos) {
            if (organizations.datos.hasOwnProperty(org)) {
                select += "<option value='"+org+"'>"+organizations.datos[org]+"</option>";
            }
        }

        message += select + '</select>';

    } catch (e) {
        //mensaje ya es DEFAULT
    }

    return message;

};

//Flujo_Personalizacion_Diseño_Servicios
function showDepartments(departments){
    var message = 'Gerencia Solicitante:<br/>';

    departments = JSON.parse(departments);

    try {

        var select = '<select id="department" onchange="setDepartment(this.value)">';

        select += "<option>--Selecciona--</option>";
        for (var dep in departments.datos) {
            if (departments.datos.hasOwnProperty(dep)) {
                select += "<option value='"+dep+"'>"+departments.datos[dep]+"</option>";
            }
        }

        message += select + '</select>';

    } catch (e) {
        //mensaje ya es DEFAULT
    }

    return message;

};

function showCavList(chatbot,cavs){
    //se puede usar el api para obtener las variables generadas por el webhook para mostrar las cuentas del usuario
    //podría hacerse en el callback
    xchatbot = chatbot;
    var message = 'Selecciona el CAV donde estas ubicado:<br/>';

    try {
        var select = '<select id="cav" onchange="diagnosticoRed.runTest(this.value)">';

        select += "<option>--Selecciona--</option>";
        for (var i in cavs) {
            if (cavs.hasOwnProperty(i)) {
                select += "<option value='"+cavs[i]+"'>"+cavs[i]+"</option>";
            }
        }

        message += select + '</select>';

    } catch (e) {
        //mensaje ya es DEFAULT
    }

    return message;

};

function getDirectCallToCreate(datos){

  var checkDirectCall = [];
  checkDirectCall.push(datos.Product_Categorization_Tier_1);
  checkDirectCall.push(datos.Product_Categorization_Tier_2);
  checkDirectCall.push(datos.Product_Categorization_Tier_3);

  checkDirectCall.push(datos.Service_Categorization_Tier_1);
  checkDirectCall.push(datos.Service_Categorization_Tier_2);
  checkDirectCall.push(datos.Status_PDA);

  //No importa Product_Categorization_Tier_2
  var checkDirectCall_2 = [];
	checkDirectCall_2.push(datos.Product_Categorization_Tier_1);
	checkDirectCall_2.push(datos.Product_Categorization_Tier_3);

	checkDirectCall_2.push(datos.Service_Categorization_Tier_1);
	checkDirectCall_2.push(datos.Service_Categorization_Tier_2);
	checkDirectCall_2.push(datos.Status_PDA);

	var direct_call_option = 'create_case'; //ID 2186 - Crear solicitud

	if(typeof(datos.Product_Name) != 'undefined' && datos.Product_Name.trim()){
		xchatbot.api.addVariable('CLRID_PRODUCT_NAME', datos.Product_Name);
	}

	if(datos.flow == 'Incidente'){
		//ya esta definida
	} else {
		//FIXME revisar si se tiene que hacer esta verificacion
	}
  //No importa Product_Categorization_Tier_2
  //Product_Categorization_Tier_1.Product_Categorization_Tier_3.Service_Categorization_Tier_1.Service_Categorization_Tier_2.Status_PDA
  switch(checkDirectCall_2.join('.').toLowerCase()){
    case 'hardware.hardware.servicios de it para it.soporte.enabled':
      //Flujo_Soporte - Hardware
      //Tipo de Hardware = Service_Categorization_Tier_2
      //Elemento de Hardware=Product_Name
      var_extra_info = "\nTipo de Hardware: " + datos.Product_Categorization_Tier_2;
      var_extra_info += "\nElemento de Hardware: " + datos.Product_Name;
      break;
    case 'software.bases de datos.servicios de it para it.soporte.enabled':
      //Flujo_Soporte - Bases de datos
      direct_call_option = 'create_case_type_soporte_bases_datos';
      var_extra_info = "\nTipo de base de datos: " + datos.Product_Name;
      break;
    default:
      //ya manda  a 'create_case'
      //continua el flujo
      break;
  }

  //Product_Categorization_Tier_1.Product_Categorization_Tier_2.Product_Categorization_Tier_3.Service_Categorization_Tier_1.Service_Categorization_Tier_2.Status_PDA
	switch(checkDirectCall.join('.').toLowerCase()){

    case 'servicio.seguridad.infraestructura de seguridad.mi seguridad de la informacion.soporte.enabled':
      //Flujo_Soporte - Infraestructura de Seguridad
      //Subtema=Product_Name
      var_extra_info = "\nSubtema: " + datos.Product_Name;
      direct_call_option = 'create_case_type_1'; //placa o hostname del equipo
      break;
    case 'software.aplicacion.middleware.servicios de it para it.soporte.enabled':
      //Flujo_Soporte - Middleware
      //Modulo=Product_Name
      //Falla presentada=Service_Categorization_Tier_3
      var_extra_info = "\nModulo: " + datos.Product_Name;
      var_extra_info += "\nFalla Presentada: " + datos.Service_Categorization_Tier_3;
      direct_call_option = 'create_case_type_soporte_middleware';
      break;
    case 'software.aplicacion.soporte al negocio.mis aplicaciones del negocio.soporte.enabled':
      //Flujo_Soporte - Mis Aplicaciones de Negocio
      //Modulo=Product_Name
      var_extra_info = "\nModulo: " + datos.Product_Name;
      break;
    case 'facilidades.comunicacion.salas virtuales.mis comunicaciones y herramientas colaborativas.soporte.enabled':
      //Flujo_Soporte - Salas virtuales
      //Sala=Product_Name
      //Tipo de falla = Service Categorization Tier 3
      var_extra_info = "\nSala: " + datos.Product_Name;
      var_extra_info += "\nTipo de falla: " + datos.Service_Categorization_Tier_3;
      break;

    case 'facilidades.herramientas.office365.mis comunicaciones y herramientas colaborativas.soporte.enabled':
      //Flujo_Soporte - Office365
      //Herramienta=Product_Name
      //Tipo de falla = Service Categorization Tier 3
      var_extra_info = "\nHerramienta: " + datos.Product_Name;
      var_extra_info += "\nTipo de falla: " + datos.Service_Categorization_Tier_3;
      break;

    case 'software.base de datos.bases de datos.servicios de it para it.asesorias y solicitudes.enabled':
        //Flujo_Asesorias y Solicitudes - Bases de datos
        //Tipo de base de datos=Product_Name
        //Base destino = Service Categorization Tier 3
        var_extra_info = "\nTipo de base de datos: " + datos.Product_Name;
        var_extra_info += "\nBase destino: " + datos.Service_Categorization_Tier_3;
        direct_call_option = 'create_case_type_asesorias_bases_datos';
        break;

    case 'servicio.software.microsoft office.mi estacion de trabajo y conectividad.soporte.enabled':
		case 'servicio.hardware.pc de escritorio.mi estacion de trabajo y conectividad.soporte.enabled':
		case 'servicio.hardware.portatil.mi estacion de trabajo y conectividad.soporte.enabled':
		case 'servicio.software.otras herramientas de oficina.mi estacion de trabajo y conectividad.soporte.enabled':
		case 'servicio.periferico.perifericos / accesorios.mi estacion de trabajo y conectividad.soporte.enabled':
			direct_call_option = 'create_case_type_1'; //placa o hostname del equipo
			break;
		case 'servicio.seguridad.infraestructura de seguridad.mi seguridad de la informacion.asesorias y solicitudes.enabled': //FIXME FALTA PRODUCT NAME, ES NECESARIO?
			direct_call_option = 'create_case_type_2'; //direccion ip del equipo
			break;
    case 'servicio.tecnico.diseño de servicios.servicios de it para it.asesorias y solicitudes.enabled':

      //Flujo_Personalizacion_Diseño_Servicios
      if(datos.Service_Categorization_Tier_3.toLowerCase() == 'acercamiento entrega operaciones introduccion del servicio'){

        //categoria:
        //Acercamiento entrega operaciones introducción del servicio

        direct_call_option = 'create_case_type_acercamiento_entrega';
      } else {
        //categoria:
        //Capacitación proceso introducción del servicio
        //Acercamiento entrega operaciones introducción del servicio
        //Seguimiento de entrega a operaciones
        //Validación de entregables
        //Asesoría catálogo de servicio/diseño de servicio
        //Actualización árbol categorización / catálogo de servicios
        //Crear/Modificar/Eliminar Grupos Resolutores

        direct_call_option = 'create_case_type_disenio_servicios';
      }

      break;
      case 'servicio.calidad.sugerencias y felicitaciones myit.buzon de sugerencias e informacion.sugerencias y felicitaciones myit.enabled':
        //Flujo felicitaciones
        direct_call_option = 'create_case_congratulation'; //flujo felicitaciones
        break;

		default:
			//ya manda  a 'create_case'
			break;
	}

	return direct_call_option;

}

function showCategories(chatbot,categories_origin){
    //se puede usar el api para obtener las variables generadas por el webhook para mostrar las cuentas del usuario
    //podría hacerse en el callback
    xchatbot = chatbot;
    var message = 'Selecciona la categoria:<br/>';

    try {

        const categories = {};

        const product_groups = {};
        const service_groups = {};

        Object.keys(categories_origin).forEach(function(key) {

            let group1x = categories_origin[key].Product_Categorization_Tier_3;
            let group2x = categories_origin[key].Product_Name;

            if(typeof(categories[group1x]) == 'undefined' ){
                categories[group1x] = {};
            } else {
                //
            }

            if(typeof(categories[group1x][group2x]) == 'undefined' ){
                categories[group1x][group2x]= [];
            } else {
                //
            }

            categories[group1x][group2x].push(categories_origin[key]);

        });


        var select = '<select id="category" onchange="setCategory(this.value)">';

        select += "<option>--Selecciona--</option>";

        for (var group1 in categories) {

            if (categories.hasOwnProperty(group1)) {

                select += "<optgroup label='-" + group1 + "'>";

                for (var group2 in categories[group1]) {

                    select += "<optgroup label='--" + group2 + "'>";

                    if (categories[group1].hasOwnProperty(group2)) {

                        for (var i in categories[group1][group2]) {
                            select += "<option value='"+categories[group1][group2][i].CLR_ID+"'>"+ categories[group1][group2][i].Service_Categorization_Tier_3 +"</option>";
                        }

                    }

                    select += "</optgroup>";

                }

                select += "</optgroup>";

            }
        }

        message += select + '</select>';

    } catch (e) {
        //mensaje ya es DEFAULT
    }

    return message;

};



function gestionaRespuesta(chatbot) {
    xchatbot = chatbot;
    tratamiento.imgModal();

    var site = var_site;
    var customer_type = var_customer_type;
    var usuario_red = usuarioid;
    var clr_id = var_clr_id;

    chatbot.subscriptions.onSendMessage( function(messageData, next) {

      if(var_release_support_response == 'waiting'){
        var_release_support_response = messageData.message.toLowerCase();
      }

       return next(messageData);
     }
    );

    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        let originalString = 'Hola {nombre} soy Anita, tu asistente virtual, ¿En qué puedo ayudarte?';
        var mensaje = messageData;

        if(typeof(messageData.user) != 'undefined'){

            userNotifications++;

            if(userIsActive){
              //user is here
              userNotifications = 0;
              document.title = originalDocumentTitle;
            } else {

              var txtNotifications = '(' + userNotifications + ') ';
              document.title = txtNotifications + originalDocumentTitle;
            }

            //audio para hablar con agente
            var audio = new Audio('https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/swiftly-610.mp3');
            audio.play();

            return next(messageData);
        } else {
          if(userIsActive){
            //user is here
            userNotifications = 0;
            document.title = originalDocumentTitle;
          }
        }

        if(var_adjuntar_archivo_nota){
            xchatbot.actions.hideUploadMediaButton();
        }

        if(messageData.attributes) {

            if(messageData.message.search(/ignorar/i) >= 0){
                next = null;
            }

            switch(messageData.message){
                case "ignorar":
                    next = null;
                    break;
            }

            //Se esta mostrndo un tipo de mensaje en especifico
            //Vamos a construir una respuesta con base en la informacion asignada al objeto
            switch(messageData.attributes.DIRECT_CALL){
                    case 'felicitacion_myit':
                        var_flujo_felicitacion = true;
                      break;
                    case 'select_diagnosis_test_type':
                            messageData.message += "<br><button class='chatbot_button' onclick='setDiagnosisType(\"ultima_milla\",\"Última milla\")'>Última milla</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setDiagnosisType(\"citrix\",\"Citrix\")'>Citrix</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setDiagnosisType(\"poliedro\",\"Poliedro\")'>Poliedro</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setDiagnosisType(\"correo\",\"Correo\")'>Correo</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setDiagnosisType(\"dhcp\",\"DHCP\")'>DHCP</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setDiagnosisType(\"usuario\",\"Prueba Local\")'>Prueba Local</button>";
                        break;
                default:
                    //
                    if(messageData.attributes.DIRECT_CALL){
                        var checkDirectCall = messageData.attributes.DIRECT_CALL.split('_');

                        if(checkDirectCall.length == 3 && checkDirectCall[0] == 'ef'){ //ef = escalate form
                            customEscalateForm = checkDirectCall[2];
                        }
                    }

                    break;
            }

        } else {

            try {

                var obj = JSON.parse(messageData.message);

                switch(obj.metodo){

                    case "obtener_sitios":

                        categoriesTries = 1;

                        next = null;
                        showSites(xchatbot,obj.datos);

                        break;

                    case "obtener_tipos_clientes":

                        messageData.message = showCustomerTypes(xchatbot,obj.datos);

                        break;

                    case "sin_resultado_categorias":

                        if(categoriesTries == 2){

                            messageData.message = obj.message;

                            var directMessageData = {
                                message: var_customer_type,
                                directCall: 'get_categories_max_attempts', //seleccionado sl tipo de cliente hay que solicitar las categorias
                            }

                            xchatbot.actions.sendMessage(directMessageData);

                        } else {

                            categoriesTries++;

                            messageData.message = obj.message;

                            var directMessageData = {
                                message: var_customer_type,
                                directCall: 'show_categories', //seleccionado sl tipo de cliente hay que solicitar las categorias
                            }

                            xchatbot.actions.sendMessage(directMessageData);

                        }

                        break;

                    case "obtener_categorias":

                        categoriesTries = 1;

                        messageData.message = showCategories(xchatbot,obj.datos);

                        break;

                    case "mostrar_instrucciones":

                        messageData.message = obj.datos.Instructions;

                        var_isIncident = obj.datos.Flow == 'Incidente' ? true : false;

						            var directCallOption = getDirectCallToCreate(obj.datos);

                        var directMessageData = {
                            message: 'Crear caso',
                            directCall: directCallOption, //ya deberiasmo tener todo lo necesario para solicitar la descripción del caso
                        }

                        xchatbot.actions.sendMessage(directMessageData);

                        break;
                    case "create_congratulation":

                      messageData.message = obj.datos.message;

                      break;

                    case "create_case":

                        messageData.message = obj.datos.message;

                        var_numero_caso = obj.datos.numero_caso;

                        var directMessageData = {
                            message: 'Crear nota de caso',
                            directCall: 'crear_nota_opcional', //se creó el caso y se debería agregar una nota?
                        }

                        xchatbot.actions.sendMessage(directMessageData);

                        break;

                    case "create_case_note":

                        var_adjuntar_archivo_nota = false;

                        xchatbot.actions.hideUploadMediaButton();

                        messageData.message = obj.datos.message;

                        break;

                    case 'incidente':
                    case 'ordentrabajo':
                    case 'requerimiento':
                    case 'historial':

                        next = null;
                        tratamiento.consulta(obj);

                        break;

                    default:

                        messageData.message = showCavList(xchatbot,obj);

                        break;

                }


            }catch (e) {

                messageData = mensaje;

                if(typeof(messageData.actionField) != 'undefined' && messageData.actionField && Object.keys(messageData.actionField).length > 0){

                  switch(messageData.actionField.variableName){
                    case 'release_support':
                        var_release_support_response = 'waiting';
                      break;
                      case 'support_responsible':

                        if(var_release_support_response == 'no'){
                          xchatbot.actions.sendMessage({message: "NA"});
                          next = false;
                        }

                      break;

                      case 'support_infrastructure':

                        if(var_release_support_response == 'no'){
                          xchatbot.actions.sendMessage({message: "NA"});
                          next = false;
                        }

                      break;

                      case 'support_period':

                        if(var_release_support_response == 'no'){
                          xchatbot.actions.sendMessage({message: "1"});
                          next = false;
                        }

                        break;

                  }

                }

                switch(messageData.message){

                    case "ignorar_archivo":

                        next = false;
                        xchatbot.actions.sendMessage({message: var_archivo});

                        break;

                    case "ignorar_nota":
                        next = false;

                        var_adjuntar_archivo_nota = true;
                        xchatbot.actions.showUploadMediaButton();

                        break;

                    case "ignorar":
                        next = false;
                        break;

                    case 'select_request_organization':

                        designService.getOrganizations();
                        next = false;

                        break;

                    case 'select_request_department':

                        designService.getDepartments();
                        next = false;

                        break;

                    case 'select_impact_urgency':


                        if(var_isIncident){

                            messageData.message = 'Selecciona el porcentaje de usuarios afectados:<br>'
                            messageData.message += '<select id="impact" onchange="setImpact(this.value)">';

                            messageData.message += "<option>-- Impacto --</option>";

                            messageData.message += "<option value='1-Extensive/Widespread'>Mayor a 50% de un area/clientes</option>";
                            messageData.message += "<option value='2-Significant/Large'>Entre 25% y 50% de un area/clientes</option>";
                            messageData.message += "<option value='3-Moderate/Limited'>Entre 10% y 25% de un area/clientes</option>";
                            messageData.message += "<option value='4-Minor/Localized'>Menos del 10% de un area/cliente</option>";

                            messageData.message += '</select>';

                            messageData.message += '<br><br>Selecciona como impacta tus labores:<br>'
                            messageData.message +='<select id="urgency" onchange="setUrgency(this.value)">';

                            messageData.message += "<option>-- Urgencia --</option>";

                            messageData.message += "<option value='2-High'>Total</option>";
                            messageData.message += "<option value='3-Medium'>Parcial</option>";
                            messageData.message += "<option value='4-Low'>Ninguna</option>";

                            messageData.message += '</select>';

                        } else {
                            next = false;
                            xchatbot.actions.sendMessage({message: 'TEXTO DUMMY'});
                        }

                        break;

                    case 'selecciona_zona':

                            messageData.message = "Selecciona la región a la cual pertenece el CAV donde estas ubicado:"

                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Region Centro\")'>Región Centro</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Region Costa\")'>Región Costa</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Region Noroccidente\")'>Región Noroccidente</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Region Occidente\")'>Región Occidente</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Region Oriente\")'>Región Oriente</button>";

                        break;

                    case "create_case_params_extra_info":

                            next = false;

                            xchatbot.actions.sendMessage({message: var_extra_info});

                            var_extra_info = "";

                            break;

                    case "create_case_params":

                        next = false;

                        var paramsObj = {'site':var_site,
                          'customer_type':var_customer_type,
                          'clr_id':var_clr_id,
                          'user':usuarioid, //fixme
                          'impact': var_impact,
                          'urgency': var_urgency
                        };

                        if(var_extra_info){
                          paramsObj['extra_info'] = var_extra_info;
                        }

                        var createCaseParams = JSON.stringify(paramsObj);

                        xchatbot.actions.sendMessage({message: createCaseParams});

                        var_customer_type = "";
                        var_site = "";
                        var_clr_id = "";

                        var_release_support_response = "";

                        var_impact = "";
                        var_urgency = "";
                        var_extra_info = "";

                        var_isIncident = false;

                        break;

                    case "create_note_params":

                        next = false;

                        var createNoteParams = JSON.stringify({'file_reference':var_archivo,'user':usuarioid,'case':var_numero_caso});

                        xchatbot.actions.sendMessage({message: createNoteParams});

                        var_adjuntar_archivo_nota = false;
                        var_archivo = "";
                        var_numero_caso = "";

                        break;

                    case "site":
                        next = false;

                        xchatbot.actions.sendMessage({message: var_site});

                        break;

                    case "numero_caso":
                        next = false;

                        xchatbot.actions.sendMessage({message: var_numero_caso});

                        break;

                    case "customer_type":
                        next = false;
                        xchatbot.actions.sendMessage({message: var_customer_type});

                        break;

                    case "usuario_red":
                        next = false;

                        xchatbot.actions.sendMessage({message: usuarioid});

                        break;
                    case "clrid":
                        next = false;

                        xchatbot.actions.sendMessage({message: var_clr_id});
                        break;
                    default:

                        if(var_tipoDiagnostico && messageData.message.search('Digita la IP a revisar') >= 0){
                            if(var_tipoDiagnostico == 'usuario'){
                                //espera acción del usuario
                            } else {
                                //la IP no es importante
                                next = false;
                                xchatbot.actions.sendMessage({message: '122.122.122.122'}); //IP DUMMY QUE SE VA A IGNORAR
                            }
                        }

                        break;

                }

            }

        }

        if(next){
            return next(messageData);
        } else {
            //nada
        }

    });

    chatbot.subscriptions.onUploadMedia(function(media, next) {

        if(var_adjuntar_archivo_nota){

            xchatbot.actions.hideUploadMediaButton();
            xchatbot.actions.disableInput();
            xchatbot.actions.displaySystemMessage({translate: false,message: 'Almacenando archivo'});

            xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/files/upload');
            xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function() {

                if (xhr.status === 200) {
                    var_archivo = JSON.parse(xhr.responseText); //se indica la referencia al archivo
                    xchatbot.actions.displaySystemMessage({translate: false,message: 'Archivo almacenado correctamente'});
                } else {
                    var_archivo = ''; //se elimina la referencia al archivo
                    xchatbot.actions.displaySystemMessage({translate: false,message: 'Error al almacenar el archivo. Intentalo mas tarde'});
                }

                xchatbot.actions.enableInput();

            };

            var reader = new FileReader();
            reader.readAsDataURL(media.file);

            reader.onload = function () {

                //Se envia el archivo en base64
                xhr.send(JSON.stringify({
                    file: reader.result,
                    filename: media.file.name,
                    messageId: media.messageId,
                }));

            };

            reader.onerror = function (error) {
              console.log('Error: ', error);
              xchatbot.actions.displaySystemMessage({translate: false,message: 'Error al procesar el archivo. Intentalo mas tarde'});
              xchatbot.actions.enableInput();
            };

        } else {
            return next(media);
        }

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

                            var_numero_caso = datos.datos.no_incidente;

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

                            if(typeof(datos.datos.notas[i].archivos) != 'undefined'){

                              for (var j = 0; j < datos.datos.notas[i].archivos.length; j++) {
                                cons += "<br/><button class='chatbot_button' onclick='downloadBase64File(\"" + datos.datos.notas[i].archivos[j].archivo_nombre+ "\",\"" + datos.datos.notas[i].archivos[j].archivo_contenido+ "\",\"" + datos.datos.notas[i].archivos[j].archivo_mime_type+ "\")'>"+datos.datos.notas[i].archivos[j].archivo_nombre+"</button>";
                              }

                            }

                    }

                    cons += '<br/><button onclick="addNote()">Agregar nota</button>';

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

                        var_numero_caso = datos.datos.no_incidente;

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

                        if(typeof(datos.datos.notas[i].archivos) != 'undefined'){

                          for (var j = 0; j < datos.datos.notas[i].archivos.length; j++) {
                            cons += "<br/><button class='chatbot_button' onclick='downloadBase64File(\"" + datos.datos.notas[i].archivos[j].archivo_nombre+ "\",\"" + datos.datos.notas[i].archivos[j].archivo_contenido+ "\",\"" + datos.datos.notas[i].archivos[j].archivo_mime_type+ "\")'>"+datos.datos.notas[i].archivos[j].archivo_nombre+"</button>";
                          }

                        }
                    }

                    cons += '<br/><button onclick="addNote()">Agregar nota</button>';

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

                    var_numero_caso = datos.datos.no_caso;

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

                            if(typeof(datos.datos.caso.notas[i].archivos) != 'undefined'){

                              for (var j = 0; j < datos.datos.caso.notas[i].archivos.length; j++) {
                                cons += "<br/><button class='chatbot_button' onclick='downloadBase64File(\"" + datos.datos.caso.notas[i].archivos[j].archivo_nombre+ "\",\"" + datos.datos.caso.notas[i].archivos[j].archivo_contenido+ "\",\"" + datos.datos.caso.notas[i].archivos[j].archivo_mime_type+ "\")'>"+datos.datos.caso.notas[i].archivos[j].archivo_nombre+"</button>";
                              }

                            }
                    }

                    cons += '<br/><button onclick="addNote()">Agregar nota</button>';

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

            xchatbot.actions.showSideWindow(contenido);

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

var diagnosticoRed = (function (window, undefined) {

    var runTest = function(cav){

        const userMessageData = {
            message: cav,
        }

        xchatbot.actions.displayUserMessage(userMessageData);

	      xchatbot.api.addVariable('DIAGNOSIS_TYPE', var_tipoDiagnostico).then(function(){
	        xchatbot.api.addVariable('CAV', cav);
        });

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/diagnosticadorservicios/prueba');
        xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {

            if (xhr.status === 200) {

                xchatbot.actions.enableInput();

                diagnosticoRed.resultados(xhr.responseText);

            } else {
                xchatbot.actions.displaySystemMessage({translate: false,message: 'Error al realizar el diagnóstico. Intentalo mas tarde'});
            }

            var_tipoDiagnostico = '';
            var_ipDiagnosticar = '';

        };

        xchatbot.actions.disableInput();
        xchatbot.actions.displaySystemMessage({translate: false,message: "Realizando diagnóstico. Puede tardar algunos minutos, por favor espera a que se muestre el resultado.<br><br>Si tienes alguna inquietud o tu diagnóstico fue fallido genera un requerimiento en MyIT y escala con Red Corporativa - Nocdatos comunicándote a las extensiones 65789 o 65786 opción 2 o a la sala 06623."});

        webhookLoader.show();

        //Se envia el archivo en base64
        xhr.send(JSON.stringify({
            prueba: var_tipoDiagnostico,
            cav: cav,
            ip: var_ipDiagnosticar
        }));

    }

    var resultados = function(response){
        var titulo = '';
        var cons = '';
		var cons_log = '';

        var datos = JSON.parse(response);

        try {

            titulo = 'Resultado de diagnóstico ';

            if(datos.status == 'success'){

                var responses = JSON.parse(datos.chatbot_response);

                for (var i = 0; i < responses.length; i++) {

                    cons += '<div><strong>Destino: ' + responses[i].destino + '</strong></div> ' +
                            '<div><strong style="font-size:18px;">Estado: ' + responses[i].estado + ' </strong></div> ' +
                            '<div>Origen: '+ responses[i].origen + ' </div> ' +
                            '<div>Paquetes enviados: '+ responses[i].paquetes_enviados + ' </div> ' +
                            '<div>Tiempo máximo: '+ responses[i].tiempo_maximo + ' </div> ' +
                            '<div>Tiempo mínimo: '+ responses[i].tiempo_minimo + ' </div> ' +
                            '<div>Tiempo promedio: '+ responses[i].tiempo_promedio + ' </div> ' +
                            '<div>Porcentaje de paquetes perdidos: '+ responses[i].porcentaje_paquetes_perdidos + ' </div> ' +
                            '<hr>';

                    cons_log += '+Destino: ' + responses[i].destino +
                            '+Estado: ' + responses[i].estado +
                            '+Origen: '+ responses[i].origen +
                            '+Paquetes enviados: '+ responses[i].paquetes_enviados +
                            '+Tiempo máximo: '+ responses[i].tiempo_maximo +
                            '+Tiempo mínimo: '+ responses[i].tiempo_minimo +
                            '+Tiempo promedio: '+ responses[i].tiempo_promedio +
                            '+Porcentaje de paquetes perdidos: '+ responses[i].porcentaje_paquetes_perdidos +
                            '----';

                }

                cons += '</div>';

            } else {
                cons = datos.chatbot_response;
				cons_log = cons;
            }

			      xchatbot.api.addVariable('DIAGNOSIS_RESULT', cons_log);

            var contenido = {
                sideWindowTitle: titulo,
                sideWindowContent: cons
            };

            xchatbot.actions.showSideWindow(contenido);

        }catch (e) {

            return 'Lo siento, no he podido encontrar respuestas para tu duda.';
        }

        return 'Mira lo que tenemos para ti';
    }

    return {
        runTest : function (cav) {
            return runTest(cav);
        },
        resultados : function (tipo,datos) {
            return resultados(tipo,datos);
        }
    };

})(window, undefined);


var diagnosticoCMC = (function (window, undefined) {

    var runTest = function(values){

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/cmc/diagnostico');
        xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {

            if (xhr.status === 200) {

                xchatbot.actions.enableInput();

                diagnosticoCMC.resultados(xhr.responseText);

            } else {
                xchatbot.actions.displaySystemMessage({translate: false,message: 'Error al realizar el diagnóstico. Intentalo mas tarde'});
            }

        };

        xchatbot.actions.disableInput();
        xchatbot.actions.displaySystemMessage({translate: false,message: "Este proceso puede tardar algunos minutos. Por favor espera a que se muestre el resultado en el panel lateral."});

        webhookLoader.show();

        if(values.min){
            xhr.send(JSON.stringify({
                        min: values.min
                    }));
        } else {
            xhr.send(JSON.stringify({
                        coid: values.coid
                    }));
        }

    }

    var resultados = function(response){
        var titulo = '';
        var cons = '';

        var datos = JSON.parse(response);

        try {

            if(datos.status == 'success'){

                cons = datos.chatbot_response;

            } else {
                cons = 'Error al realizar el diagnóstico. Intentalo mas tarde';
            }

            titulo = 'Resultado de diagnóstico ';

            var contenido = {
                sideWindowTitle: titulo,
                sideWindowContent: cons
            };

            xchatbot.actions.showSideWindow(contenido);


        }catch (e) {

            return 'Lo siento, no he podido encontrar respuestas para tu duda.';
        }

        return 'Mira lo que tenemos para ti';
    }

    return {
        runTest : function (values) {
            return runTest(values);
        },
        resultados : function (tipo,datos) {
            return resultados(tipo,datos);
        }
    };

})(window, undefined);

var changeEmail = (function (window, undefined) {

    var change = function(values){

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/mesaservicio/actualizar_email_myit');
        xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {

            var msj = 'Ocurrió un erro al realizar el cambio de tu email. Intentalo mas tarde';

            if (xhr.status === 200) {
                var datos = JSON.parse(xhr.responseText);

                try {

                    if(datos.status == 'success'){
                        msj = datos.chatbot_response;
                    } else {
                        //
                    }

                    xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});

                }catch (e) {
                    xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
                }

            } else {
                xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
            }

            xchatbot.actions.enableInput();

        };

        xchatbot.actions.disableInput();
        xchatbot.actions.displayChatbotMessage({type:"answer",message: "Por favor espera. Este proceso puede tardar algunos momentos."});

        xhr.send(JSON.stringify(values));

    }

    return {
        change : function (datos) {
            return change(datos);
        }
    };

})(window, undefined);

var designService = (function (window, undefined) {

    var getOrganizations = function(){

        xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/mesaservicio/obtener_areas');
        xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {

            var msj = 'Ocurrió un error al obtener las areas. Porfavor escribe el area';

            if (xhr.status === 200) {
                var datos = JSON.parse(xhr.responseText);

                try {

                  if(datos.status == 'success'){
                      htmlOrganizations = showOrganizations(datos.chatbot_response);

                      var contenido = {
                          sideWindowTitle: 'Selecciona área',
                          sideWindowContent: htmlOrganizations
                      };

                      xchatbot.actions.showSideWindow(contenido);

                  } else {
                      xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
                  }

                } catch (e) {
                  console.log(e);
                    xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
                }

            } else {
                xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
            }

            xchatbot.actions.enableInput();

        };

        xchatbot.actions.disableInput();

        xhr.send();

    }

    var getDepartments = function(){

        xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/mesaservicio/obtener_gerencias');
        xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {

            var msj = 'Ocurrió un error al obtener el catalogo de gerencias. Porfavor escribe la gerencia';

            if (xhr.status === 200) {
                var datos = JSON.parse(xhr.responseText);

                try {

                    if(datos.status == 'success'){
                        htmlDepartments = showDepartments(datos.chatbot_response);

                        var contenido = {
                            sideWindowTitle: 'Selecciona gerencia',
                            sideWindowContent: htmlDepartments
                        };

                        xchatbot.actions.showSideWindow(contenido);

                    } else {
                        xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
                    }

                } catch (e) {
                    console.log(e);
                    xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
                }

            } else {
                xchatbot.actions.displayChatbotMessage({type:"answer",message:msj});
            }

            xchatbot.actions.enableInput();

        };

        xchatbot.actions.disableInput();

        xhr.send(JSON.stringify({'org': var_org }));

    }

    return {
        getOrganizations : function () {
            return getOrganizations();
        },
        getDepartments : function () {
            return getDepartments();
        }
    };

})(window, undefined);



var webhookLoader = (function (window, undefined) {

    var show = function(){

        titulo = 'Realizando diagnóstico ...';

        var cons = 'Por favor espera...';
        cons += '<img src="https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/loader.gif">';

        var contenido = {
            sideWindowTitle: titulo,
            sideWindowContent: cons
        };

        xchatbot.actions.showSideWindow(contenido);

    }

    return {
        show : function () {
            return show();
        }
    };

})(window, undefined);


var diagnosticarRed = function(values){
  var_ipDiagnosticar = values.ip;
}

var diagnosticarCMC = function(values){
  if(values.min || values.coid){
      diagnosticoCMC.runTest(values);
  }
}

var cambiarEmail = function(values){
    changeEmail.change(values);
}

//,contentType, base64Data
function downloadBase64File(fileName,base64Data,contentType) {

     const linkSource = `data:${contentType};base64,${base64Data}`;
     const downloadLink = document.createElement("a");
     downloadLink.href = linkSource;
     downloadLink.download = fileName;
     downloadLink.click();
}

/**
 * This adapter creator export an adapter which hides the conversation window when the user types end in the query. It accepts
 * two entry arguments as the configuration options.
 *
 *
 * @param {Function} checkAgents  [Function to check if there are agents avialable]
 * @param {String} escalateNLForm [String to be send to trigger the escalationForm]
 * @param {Object} rejectedEscalation [action and value to handle when the user rejects the escalation]
 * @param {Object} noAgentsAvailable [action and value to handle when when there are no agents available]
 * @param {Number} MaxNoResults [Number of no-results before trigger the escalation]
 * @param {Boolean} hideEscalateIntentMessage [When set to true, it will ignore the message given for the escalation message]
 */
function CLAROlaunchNLEsclationForm(checkAgents,escalateNLForm,rejectedEscalation,noAgentsAvailable,MaxNoResults,hideEscalateIntentMessage) {
  var initMaxResults=3;
  var setEscalations=true;
  var noResults=1;
  var escalateSystemMessageData={
    message: 'escalate-chat',
    translate: true,
    options: [
        {label: 'yes',value:'escalateYes'},
        {label: 'no', value:'escalateNo'}
      ]
  };


  if(hideEscalateIntentMessage === undefined){
    hideEscalateIntentMessage = true;
  }
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
            if (!hideEscalateIntentMessage) next(messageData);
              chatBot.actions.displaySystemMessage(escalateSystemMessageData);
              chatBot.actions.disableInput();
              return;
            }else if(messageData.flags.indexOf('no-results')!==-1){
              if(noResults >= MaxNoResults){
                chatBot.actions.displaySystemMessage(escalateSystemMessageData);
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
     * We use the option.value to only capture a selectSystemMessage option when it comes from the escalation systemMessage
     * @param  {[Object]}   optionData [Option selected]
     * @param  {Function} next       [Next callback to be returned]
     */
    chatBot.subscriptions.onSelectSystemMessageOption(function(optionData, next) {
      if (optionData.option.value === "escalateYes")  {
          checkAgents().then(function(result) {
            if (result.agentsAvailable) {

                lastCustomEscalateForm = customEscalateForm;

                if(customEscalateForm){ //ASIGNAMOS SUFIJO PARA DEFINIR EL CUSTOM ESCALATE FORM
                    chatBot.actions.sendMessage({message: sendEscalateForm.message + '_' + customEscalateForm});
                } else {
              chatBot.actions.sendMessage(sendEscalateForm);
                }

              customEscalateForm = ''; //se resetea el customEscalateForm para que no se quede asignado para futuros escalamientos

              return;
            }else {

              customEscalateForm = ''; //se resetea el customEscalateForm para que no se quede asignado para futuros escalamientos

              if(noAgentsAvailable.action=="displayChatbotMessage"){
                chatBot.actions.displayChatbotMessage({type:'answer',message:noAgentsAvailable.value,translate:true});
              }else if (noAgentsAvailable.action =="intentMatch"){
                chatBot.actions.sendMessage({message:noAgentsAvailable.value});
              }
              chatBot.api.track('CONTACT_UNATTENDED',{value:"TRUE"});
              chatBot.actions.enableInput();
              return;
            }
          });
        }else if (optionData.option.value === "escalateNo") {

          customEscalateForm = ''; //se resetea el customEscalateForm para que no se quede asignado para futuros escalamientos

          if (rejectedEscalation.action =='intentMatch') {
            chatBot.actions.sendMessage({message:rejectedEscalation.value});
          }else if (rejectedEscalation.action =='displayChatbotMessage'){
            chatBot.actions.displayChatbotMessage({type:'answer',message:rejectedEscalation.value});
          }
          chatBot.api.track('CONTACT_REJECTED',{value:"TRUE"});
          chatBot.actions.enableInput();
        }else{
          return next(optionData);
        }
    });
    chatBot.subscriptions.onEscalateToAgent(function(escalationData, next) {

        var checkCustomForm = lastCustomEscalateForm;

        escalationData.cargo = getSessionVariable("Job_Title");
        escalationData.ubicacion = getSessionVariable("Site");
        escalationData.perfil = getSessionVariable("ProfileId");

      chatBot.api.track('CONTACT_ATTENDED',{value:"TRUE"});

        chatBot.api.getVariables().then( (vars) => {

                var varsToSend = [];

                switch(checkCustomForm){
                    case 'MAC':
                            varsToSend.push('mac_address');
                        break;
                    case 'MACIP':
                            varsToSend.push('mac_address');
                            varsToSend.push('ip_address');
                        break;
                    case 'PING':
                            varsToSend.push('ping_done');
                            varsToSend.push('sede');
                        break;
                    case 'MACSITE':
                            varsToSend.push('mac_address');
                            varsToSend.push('sede');
                        break;
                    case 'APP':
                            varsToSend.push('app_worked');
                            varsToSend.push('app_name');
                            varsToSend.push('app_ip_url');
                        break;
                    case 'EXT':
                            varsToSend.push('ext');
                            varsToSend.push('mac_address');
                            varsToSend.push('sede');
                        break;
                }

                for(var x in varsToSend){
                    if(typeof(vars.data[varsToSend[x]]) != 'undefined'){
                        escalationData[varsToSend[x]] = vars.data[varsToSend[x]].value;
                    }
                }

      return next(escalationData);


            }
        );

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

initChatbot('token');

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    userIsActive = true;
  } else {
    userIsActive = false;
  }
});
