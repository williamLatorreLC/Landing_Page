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

var nombre,apellido,staff,organizacion,depto,titulo,mail,id,perfilstatus,usuarioid,site;
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
var perfiles_backstage = { '0' : 4,
    '1' : 5,
    '5' : 1 //ID backstage default
};
var perfil_contenido = getQueryVariable("ProfileId");
var perfil_inbenta = parseInt(perfil_contenido, 10);
var avatar_name = "Anita";
var username = nombre+" "+apellido;
var datospersonales = "Nombre: "+nombre+" "+apellido+" | Tipo de usuario: "+staff+" | Estado de usuario: "+perfilstatus+" | Dirección Área: "+organizacion+" | Gerencia: "+depto+" | Cargo: "+titulo+" | Usuario Red: "+usuarioid+" | Correo: "+mail+" | Perfil Contenido: "+perfil_contenido+" | Ubicación: "+site; // Variable con todos los datos
//var perfil_contenido = perfiles_backstage[id]; EDICION ANTERIOR

var intentos = 1; //Número de intentos antes de contactar asesor
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

// Inicializa el chatbot
function initChatbot(type){

    var surveyID = 1;

    var DomainKey = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9qZWN0IjoiY2xhcm9fY29fc2VydmljaW9zSVRfY2hhdGJvdF9lcyIsImRvbWFpbl9rZXlfaWQiOiJCWEZNNXhqZV9aSFZGRU0yaG4wMnN3OjoifQ.YDNhj2vByXsv6VShdUNndzWRwMape77ZRNqV3_9zMbb_3NUMo7-lsOQKdAEILoUVCvRnV78bzEjD_HOC3O-i3A';
    //var DomainKey = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9qZWN0IjoiY2xhcm9fY29fc2VydmljaW9zSVRfY2hhdGJvdF9lcyIsImRvbWFpbl9rZXlfaWQiOiJCVzVsVFFDd3Y0ODlpWmRua2lwM0p3OjoifQ.OGp-xTI0cPojEhlXi3WTB87ZcrSsrJNFhD_-UanvsV4NUInB6HQ6EqhVFp3Xiwt2xsNWTfSD3_lOVJHpAB_58Q';
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
        queue            : { active   : true,
            priority : function() { return 1; }
        },
        surveys          : { id: 1 }
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
            noRespuesta,
            stringManipulate, //llama la funcion para cambiar el texto de bienvenida del chatbot
            openWindow, //acciones onReady
            SDKlaunchNLEsclationForm(SDKHCAdapter.checkEscalationConditions,'ChatWithLiveAgentContactForm',rejectedEscalation, noAgentsAvailable, intentos),

            SDKHCAdapter.build(), // IMPORTANTE: requiere crear un contenido en el KNOWLEDGE del chatbot con nombre 'ChatWithLiveAgentContactForm' con una respuesta personalizada, posteriormente crear un FORM dentro del contenido creado con los campos requeridos. (USUARIO_RED, FIRST_NAME, EMAIL_ADDRESS, etc.)
            //https://help.inbenta.io/creating-required-contents-for-live-chat-escalation/
            //showSurvey(surveyID)

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
                select   : ['name', 'id', 'class', 'data-datos','onchange'],
                optgroup : ['label'],
                option   : ['value'] }
        }
    };
    var InbentaAuth = InbentaChatbotSDK.createFromDomainKey(DomainKey,ApiKey);
    ChatbotSDK = InbentaChatbotSDK.build(InbentaAuth, config);
}

function setSite (site){

    if(site != null){

        var_site = site;

        var directMessageData = {
            message: site,     
            directCall: 'show_customer_types', //seleccionado el site hay que solicitar tipo de usuario
        }

        xchatbot.actions.sendMessage(directMessageData);
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

function setDiagnosisType (diagnosis_type,texto){

    if(diagnosis_type != null){

        var_tipoDiagnostico = diagnosis_type;

        var directMessageData = {
            message: var_tipoDiagnostico,     
            directCall: 'select_cav', //seleccionado sl tipo de cliente hay que solicitar las categorias
        }

        xchatbot.actions.sendMessage(directMessageData);

        const userMessageData = {
            message: texto,
        }

        xchatbot.actions.displayUserMessage(userMessageData);

    }
}

function setCavZone (cav_zone){

    if(cav_zone != null){

        var directMessageData = {
            message: cav_zone,     
        }

        xchatbot.actions.sendMessage(directMessageData);

        const userMessageData = {
            message: cav_zone,
        }
        
        xchatbot.actions.displayUserMessage(userMessageData);

    }
}


function setCustomerType (customer_type){

    if(site != null){

        var_customer_type = customer_type;

        var directMessageData = {
            message: var_customer_type,     
            directCall: 'show_categories', //seleccionado sl tipo de cliente hay que solicitar las categorias
        }

        xchatbot.actions.sendMessage(directMessageData);
    }
}

function setCategory (clr_id){

    if(site != null){

        var_clr_id = clr_id;

        var directMessageData = {
            message: var_clr_id,     
            directCall: 'show_instructions', //capturados los parametros hay que solicitar la scripción detallada
        }

        xchatbot.actions.sendMessage(directMessageData);
    }
}

// accciones onReady-------------------------------------------------->

function openWindow(chatbot){
    chatbot.subscriptions.onReady(function(next) {
        //chatbot.actions.resetSession();
        chatbot.actions.showConversationWindow();
    });

    var patt = new RegExp("{*}");
    let originalString = 'Hola, ¿en qué te puedo ayudar?';
    let newString = "Hola "+username+" soy "+avatar_name+", tu asistente virtual, ¿En qué puedo ayudarte?.";

    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
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
    var message = 'Selecciona tu ubicación:<br/>';

    try {

        const sites = {};
        Object.keys(un_sites).sort().forEach(function(key) {
          sites[key] = un_sites[key];
        });

        var select = '<select id="site" onchange="setSite(this.value)">';

        select += "<option>--Selecciona--</option>";
        for (var site in sites) {
            if (sites.hasOwnProperty(site)) {
                select += "<option value='"+site+"'>"+site+"</option>";
            }
        }

        message += select + '</select>';

    } catch (e) {
        //mensaje ya es DEFAULT
    }

    return message;

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
        console.log(e);
    }

    return message;

};


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

// Funcion para cambiar los textos de NO RESPUESTA para enviar al Chat en vivo
function noRespuesta(chatbot) {
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
    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        if (messageData.message !== originalMsg_1) {
            return next(messageData)
        }
        else {
            messageData.message = newMsg_1;
            return next(messageData);
        }
    });
    // 2) -------------------------------------------------->
    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        if (messageData.message !== originalMsg_2) {
            return next(messageData)
        }
        else {
            messageData.message = newMsg_1;
            return next(messageData);
        }
    });
    // 3)-------------------------------------------------->
    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        if (messageData.message !== originalMsg_3) {
            return next(messageData)
        }
        else {
            messageData.message = newMsg_1;
            return next(messageData);
        }
    });

    //cuando el chatbot muestra respuestas pero el usuario ha indicado "NO" a las respuestas ofrecidas-------------------------------------------------->
    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
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
    chatbot.subscriptions.onDisplayUserMessage(function(messageData, next) {
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

                return next(messageData) + next(chatbot.actions.displayChatbotMessage(chatBotmessageData));
            }
            messageData.message = "No";
            return next(messageData);
        }
    });
}

// funcion para cambiar el texto de bienvenida del chatbot
function stringManipulate(chatbot) {
    var patt = new RegExp("{*}");
    let originalString = 'Hola, ¿en qué te puedo ayudar?';
    let newString = "Hola "+username+" soy "+avatar_name+", tu asistente virtual, ¿En qué puedo ayudarte?.";

    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        var res = patt.test(messageData.message);

        if(res) {
            messageData.message = messageData.message.replace('{username}', username);
            messageData.message = messageData.message.replace('{avatar_name}', avatar_name);
        } else if (messageData.message == originalString) {
            messageData.message = newString;
        }

        if(next){
            return next(messageData);
        } else {
            //nada
        }

    });
}


function gestionaRespuesta(chatbot) {
    xchatbot = chatbot;
    tratamiento.imgModal();

    var site = var_site;
    var customer_type = var_customer_type;
    var usuario_red = usuarioid;
    var clr_id = var_clr_id;

    chatbot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
        let originalString = 'Hola {nombre} soy Anita, tu asistente virtual, ¿En qué puedo ayudarte?';
        var mensaje = messageData;

        xchatbot.actions.hideUploadMediaButton();

         if(messageData.attributes) {

            switch(messageData.message){
                case "ignorar":
                    next = null;
                    break;
            }

                        //Se esta mostrndo un tipo de mensaje en especifico
            //Vamos a construir una respuesta con base en la informacion asignada al objeto
            switch(messageData.attributes.DIRECT_CALL){
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
                    break;
            }

         } else {

            try {
                
                var obj = JSON.parse(messageData.message);

                switch(obj.metodo){

                    case "obtener_sitios":

                        messageData.message = showSites(xchatbot,obj.datos);

                        break;

                    case "obtener_tipos_clientes":

                        messageData.message = showCustomerTypes(xchatbot,obj.datos);

                        break;

                    case "obtener_categorias":

                        messageData.message = showCategories(xchatbot,obj.datos);

                        break;

                    case "mostrar_instrucciones":

                        messageData.message = obj.datos.Instructions;

                        var directMessageData = {
                            message: 'Crear caso',     
                            directCall: 'create_case', //ya deberiasmo tener todo lo necesario para solicitar la descripción del caso
                        }

                        xchatbot.actions.sendMessage(directMessageData);

                        break;

                    case "create_case":

                        messageData.message = obj.datos.message;

                        var_numero_caso = obj.datos.numero_caso;

                        var directMessageData = {
                            message: 'Crear nota de caso',     
                            directCall: 'create_case_note', //se creó el caso y se debería agregar una nota?
                        }

                        xchatbot.actions.sendMessage(directMessageData);

                        break;

                    case "create_case_note":

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

                switch(messageData.message){

                    case "ignorar_archivo":
                        
                        next = false;
                        xchatbot.actions.sendMessage({message: var_archivo});

                        break;

                    case "ignorar_nota":
                        next = false;
                        xchatbot.actions.showUploadMediaButton();
                        break;

                    case "ignorar":
                        next = false;
                        break;

                    case 'selecciona_zona':

                            messageData.message = "Selecciona la zona a la cual pertenece el CAV donde estas ubicado:"

                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Zona Bogota y Sabana\")'>Zona Bogota y Sabana</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Zona Oriente\")'>Zona Oriente</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Zona Norte\")'>Zona Norte</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Zona Suroccidente\")'>Zona Suroccidente</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Zona Noroccidente\")'>Zona Noroccidente</button>";
                            messageData.message += "<br><button class='chatbot_button' onclick='setCavZone(\"Zona Eje Cafetero\")'>Zona Eje Cafetero</button>";

                        break;

                    case "create_case_params":

                        next = false;

                        var params = JSON.stringify({'site':var_site,'customer_type':var_customer_type,'clr_id':var_clr_id,'user':usuarioid});

                        xchatbot.actions.sendMessage({message: params});

                        var_customer_type = "";
                        var_site = "";
                        var_clr_id = "";

                        break;

                    case "create_note_params":

                        next = false;

                        var params = JSON.stringify({'file_reference':var_archivo,'user':usuarioid,'case':var_numero_caso});

                        xchatbot.actions.sendMessage({message: params});

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

        xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://asistentevirtual.claro.com.co/webhooks_mesa_servicios/public/webhook/diagnosticadorservicios/prueba');
        xhr.setRequestHeader('X-REQUEST-KEY', 'RlQojyfYpHOaTSytik0Bk7fgbX0JiPzj');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {

            if (xhr.status === 200) {

                xchatbot.actions.enableInput();
                diagnosticoRed.resultados(xhr.responseText);

            } else {
                xchatbot.actions.displaySystemMessage({translate: false,message: 'Error al almacenar el archivo. Intentalo mas tarde'});
            }

            var_tipoDiagnostico = '';
            var_ipDiagnosticar = '';

        };

        xchatbot.actions.disableInput();
        xchatbot.actions.displaySystemMessage({translate: false,message: "Realizando diagnóstico. Puede tardar algunos minutos, por favor espera a que se muestre el resultado.<br><br>Si tienes alguna inquietud o tu diagnóstico fue fallido genera un requerimiento en MyIT y escala con Red Corporativa - Nocdatos comunicándote a las extensiones 65789 o 65786 opción 2 o a la sala 06623."});

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

        var datos = JSON.parse(response);

        try {

            titulo = 'Resultado de diagnóstico ';

            if(datos.status == 'success'){

                var responses = JSON.parse(datos.chatbot_response);

                for (var i = 0; i < responses.length; i++) {

                    cons += '<div><strong>Destino: ' + responses[i].destino + '</strong></div> ' +
                            '<div>Estado: ' + responses[i].estado + ' </div> ' +
                            '<div>Origen: '+ responses[i].origen + ' </div> ' +
                            '<div>Paquetes enviados: '+ responses[i].paquetes_enviados + ' </div> ' +
                            '<div>Tiempo máximo: '+ responses[i].tiempo_maximo + ' </div> ' +
                            '<div>Tiempo mínimo: '+ responses[i].tiempo_minimo + ' </div> ' +
                            '<div>Tiempo promedio: '+ responses[i].tiempo_promedio + ' </div> ' +
                            '<div>Porcentaje de paquetes perdidos: '+ responses[i].porcentaje_paquetes_perdidos + ' </div> ' +
                            '<hr>';

                }

                cons += '</div>';

            } else {
                cons = datos.chatbot_response;
            }

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

var diagnosticarRed = function(values){
    
    var_ipDiagnosticar = values.ip;

}

initChatbot('token');