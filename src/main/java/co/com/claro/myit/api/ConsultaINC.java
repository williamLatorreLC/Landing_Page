
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import co.com.claro.myit.service.CTMPeopleWsGetService;
import co.com.claro.myit.service.CTMSupportGroupPeopleService;
import co.com.claro.myit.service.ConsultaIncidenteService;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONObject;
import org.json.XML;


/**
 *
 * @author dussan.palma
 */
@Path("/ConsultarINC")
public class ConsultaINC {

    @Context
    private ServletContext context;

    private functions fn;

    @Context
    private HttpServletRequest request;

    @POST
    @Produces("application/json")
    public String consultarINC(String data) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        ConsultaIncidenteRequest datos = fn.getData(data, ConsultaIncidenteRequest.class);
        ConsultaIncidenteService consultaIncidenteService = new ConsultaIncidenteService(datos, fn);
        responseString = consultaIncidenteService.consultarINC();
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());
        JsonObject res = consultaIncidenteService.getBody(respuesta);

        if (res.has("message") && res.get("message").getAsString().equals("¡Ups! Parece que este caso no existe. Te sugiero revisar esta información.")) {
            return fn.respOk(res);
        } else {

            HttpSession session = request.getSession(false);
            String userLogueado = (String) session.getAttribute("UserLogueado");

            // Llamar al método ctmPeopleWsGet con el Remedy_Login_ID del que se loguea
            String responseCTMPeople = ctmPeopleWsGet(userLogueado);

            // Extraer varibles de la INC Assignee_Login_ID, Requestor_ID, Requestor_By_ID 
            String assigneeLoginID = null;
            Pattern pattern = Pattern.compile("<Assignee_Login_ID>(.*?)</Assignee_Login_ID>");
            Matcher matcher = pattern.matcher(responseString);
            if (matcher.find()) {
                assigneeLoginID = matcher.group(1);
                System.out.println("Assignee_Login_ID encontrado: " + assigneeLoginID);
            } else {
                System.out.println("No se encontró assigneeLoginID en el XML.");
            }

            String requestorID = null;
            Pattern patternRequestorID = Pattern.compile("<Requestor_ID>(.*?)</Requestor_ID>");
            Matcher matcherRequestorID = patternRequestorID.matcher(responseString);
            if (matcherRequestorID.find()) {
                requestorID = matcherRequestorID.group(1);
                System.out.println("Requestor_ID encontrado: " + requestorID);
            } else {
                System.out.println("No se encontró Requestor_ID en el XML.");
            }

            String requestorByID = null;
            Pattern patternRequestorByID = Pattern.compile("<Requestor_By_ID>(.*?)</Requestor_By_ID>");
            Matcher matcherRequestorByID = patternRequestorByID.matcher(responseString);
            if (matcherRequestorByID.find()) {
                requestorByID = matcherRequestorByID.group(1);
                System.out.println("Requestor_By_ID encontrado: " + requestorByID);
            } else {
                System.out.println("No se encontró Requestor_By_ID en el XML.");
            }

            // Llamar al método ctmPeopleWsGet con las variables Assignee_Login_ID, Requestor_ID, Requestor_By_ID de la INC
            String responseAssigneeLoginID = ctmPeopleWsGet(assigneeLoginID);
            String responseRequestorID = ctmPeopleWsGet(requestorID);
            String responseRequestorByID = ctmPeopleWsGet(requestorByID);

            // Variables Id_Comite_CA, Id_Gerencia_CA, Id_Area_CA  del usuario logueado
            String IdComiteCAUserLogueado = extractValue(responseCTMPeople, "\"Id_Comite_CA\":\"(\\d+?)\"");
            String IdGerenciaCAUserLogueado = extractValue(responseCTMPeople, "\"Id_Gerencia_CA\":\"(\\d+?)\"");
            String IdAreaCAUserLogueado = extractValue(responseCTMPeople, "\"Id_Area_CA\":\"(\\d+?)\"");

            System.out.println("Usuario Logueado - Id_Comite_CA: " + IdComiteCAUserLogueado);
            System.out.println("Usuario Logueado - Id_Gerencia_CA: " + IdGerenciaCAUserLogueado);
            System.out.println("Usuario Logueado - Id_Area_CA: " + IdAreaCAUserLogueado);

            // Variables Id_Comite_CA, Id_Gerencia_CA, Id_Area_CA del AssigneeLoginID
            String IdComiteAssigneeLoginID = extractValue(responseAssigneeLoginID, "\"Id_Comite_CA\":\"(\\d+?)\"");
            String IdGerenciaAssigneeLoginID = extractValue(responseAssigneeLoginID, "\"Id_Gerencia_CA\":\"(\\d+?)\"");
            String IdAreaAssigneeLoginID = extractValue(responseAssigneeLoginID, "\"Id_Area_CA\":\"(\\d+?)\"");

            System.out.println("AssigneeLoginID - Id_Comite_CA: " + IdComiteAssigneeLoginID);
            System.out.println("AssigneeLoginID - Id_Gerencia_CA: " + IdGerenciaAssigneeLoginID);
            System.out.println("AssigneeLoginID - Id_Area_CA: " + IdAreaAssigneeLoginID);

            // Variables Id_Comite_CA, Id_Gerencia_CA, Id_Area_CA del RequestorID
            String IdComiteRequestorID = extractValue(responseRequestorID, "\"Id_Comite_CA\":\"(\\d+?)\"");
            String IdGerenciaRequestorID = extractValue(responseRequestorID, "\"Id_Gerencia_CA\":\"(\\d+?)\"");
            String IdAreaRequestorID = extractValue(responseRequestorID, "\"Id_Area_CA\":\"(\\d+?)\"");

            System.out.println("RequestorID - Id_Comite_CA: " + IdComiteRequestorID);
            System.out.println("RequestorID - Id_Gerencia_CA: " + IdGerenciaRequestorID);
            System.out.println("RequestorID - Id_Area_CA: " + IdAreaRequestorID);

            // Variables Id_Comite_CA, Id_Gerencia_CA, Id_Area_CA del RequestorByID
            String IdComiteRequestorByID = extractValue(responseRequestorByID, "\"Id_Comite_CA\":\"(\\d+?)\"");
            String IdGerenciaRequestorByID = extractValue(responseRequestorByID, "\"Id_Gerencia_CA\":\"(\\d+?)\"");
            String IdAreaRequestorByID = extractValue(responseRequestorByID, "\"Id_Area_CA\":\"(\\d+?)\"");

            System.out.println("RequestorByID - Id_Comite_CA: " + IdComiteRequestorByID);
            System.out.println("RequestorByID - Id_Gerencia_CA: " + IdGerenciaRequestorByID);
            System.out.println("RequestorByID - Id_Area_CA: " + IdAreaRequestorByID);

            JsonObject response = null;

            // filtros de seguridad 
            // Condición 1: Comparación con AssigneeLoginID
            boolean condition1 = IdComiteCAUserLogueado.equals(IdComiteAssigneeLoginID)
                    && IdGerenciaCAUserLogueado.equals(IdGerenciaAssigneeLoginID)
                    && IdAreaCAUserLogueado.equals(IdAreaAssigneeLoginID);

            // Condición 2: Comparación con RequestorID
            boolean condition2 = IdComiteCAUserLogueado.equals(IdComiteRequestorID)
                    && IdGerenciaCAUserLogueado.equals(IdGerenciaRequestorID)
                    && IdAreaCAUserLogueado.equals(IdAreaRequestorID);

            // Condición 3: Comparación con RequestorByID
            boolean condition3 = IdComiteCAUserLogueado.equals(IdComiteRequestorByID)
                    && IdGerenciaCAUserLogueado.equals(IdGerenciaRequestorByID)
                    && IdAreaCAUserLogueado.equals(IdAreaRequestorByID);

            if (condition1 || condition2 || condition3) {
                response = res.getAsJsonObject();
            } else {
                System.out.println("Ninguna coincidencia encontrada. Realizando validación de seguridad... 2");

                // Llamar al método ctmSupportGroupPeople con el Remedy_Login_ID del usuario logueado
                String responseCTMSupportGroup = ctmSupportGroupPeople(userLogueado);

                // Extraer Assigned_Group_ID desde responseString
                String assignedGroupID = extractValue(responseString, "\"Assigned_Group_ID\":\"(\\w+?)\"");

                // Extraer Support_Group_IDs desde responseCTMSupportGroup (asumiendo múltiples valores)
                List<String> supportGroupIDs = extractValues(responseCTMSupportGroup, "\"Support_Group_ID\":\"(\\w+?)\"");

                // Validación adicional
                boolean matchFound = false;
                for (String supportGroupID : supportGroupIDs) {
                    if (assignedGroupID.equals(supportGroupID)) {
                        matchFound = true;
                        break;
                    }
                }

                if (matchFound) {
                    System.out.println("Decisión: Assigned_Group_ID coincide con uno de los Support_Group_ID.");
                    response = res.getAsJsonObject();
                } else {
                    System.out.println("Decisión: No coincide Assigned_Group_ID con Support_Group_ID. Realizando validación de seguridad... 3");

                    // Extraer Contact_Type de las respuestas
                    String contactTypeRemedyLoginID = extractValue(responseCTMPeople, "\"Contact_Type\":\"(\\d+?)\"");
                    String contactTypeRequestorID = extractValue(responseRequestorID, "\"Contact_Type\":\"(\\d+?)\"");
                    String contactTypeRequestorByID = extractValue(responseRequestorByID, "\"Contact_Type\":\"(\\d+?)\"");

                    // Lista de Contact_Type válidos
                    List<String> validContactTypes = Arrays.asList("6", "7", "8", "10", "11", "12", "13", "14", "16");

                    // Evaluar las condiciones
                    boolean condition1ContactType = validContactTypes.contains(contactTypeRequestorID)
                            && contactTypeRequestorID.equals(contactTypeRemedyLoginID);

                    boolean condition2ContactType = validContactTypes.contains(contactTypeRequestorByID)
                            && contactTypeRequestorByID.equals(contactTypeRemedyLoginID);

                    boolean result = condition1ContactType || condition2ContactType;

                    if (result) {
                        System.out.println("Decisión: Contact_Type coincide con los valores permitidos.");
                        response = res.getAsJsonObject();

                    } else {
                        System.out.println("Decisión: Ninguna coincidencia encontrada en Contact_Type.");
                        JsonObject mensajeSeguridad = new JsonObject();
                        mensajeSeguridad.addProperty("message", "Por políticas de seguridad no puedes consultar la información de este caso.");
                        response = mensajeSeguridad;
                    }

                }
            }

            return fn.respOk(response);
        }
    }

    @POST
    @Path("/CTMPeopleWsGet")
    @Produces("application/json")
    public String ctmPeopleWsGet(String data) {
        data = "{\"data\": {\"remedyLoginID\": \"" + data + "\"}}";
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        CTMPeopleWsGetRequest datos = fn.getData(data, CTMPeopleWsGetRequest.class);
        CTMPeopleWsGetService consultaCTMPeopleWsGetService = new CTMPeopleWsGetService(datos, fn);
        responseString = consultaCTMPeopleWsGetService.consultarCTMPeopleWsGet();
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());
        JsonObject res = consultaCTMPeopleWsGetService.getBody(respuesta);

        return fn.respOk(res.getAsJsonObject());
    }

    @POST
    @Path("/CTMSupportGroupPeople")
    @Produces("application/json")
    public String ctmSupportGroupPeople(String data) {
        data = "{\"data\": {\"remedyLoginID\": \"" + data + "\"}}";
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        CTMSupportGroupPeopleRequest datos = fn.getData(data, CTMSupportGroupPeopleRequest.class);
        CTMSupportGroupPeopleService consultaCTMSupportGroupPeopleService = new CTMSupportGroupPeopleService(datos, fn);
        responseString = consultaCTMSupportGroupPeopleService.consultarCTMSupportGroupPeople();
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());
        JsonObject res = consultaCTMSupportGroupPeopleService.getBody(respuesta);

        return fn.respOk(res.getAsJsonObject());
    }

    private static String extractValue(String input, String patternString) {
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return matcher.group(1);
        } else {
            return "No encontrado";
        }
    }

    private static List<String> extractValues(String input, String patternString) {
        List<String> values = new ArrayList<>();
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        while (matcher.find()) {
            values.add(matcher.group(1)); // Agrega cada coincidencia a la lista
        }

        return values;
    }

}
