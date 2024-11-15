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
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
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
        
        HttpSession session = request.getSession(false); 
        String userLogueado = (String) session.getAttribute("UserLogueado");

        // Llamar al método ctmPeopleWsGet con el Remedy_Login_ID del que se loguea
        String responseCTMPeople = ctmPeopleWsGet(userLogueado);
        System.out.println("Respuesta de ctmPeopleWsGet con el Remedy_Login_ID del que se loguea: " + responseCTMPeople);
       
        
        
         // Llamar al método ctmPeopleWsGet con el Requestor_ID de la respuesta del INC
        String dataCTMPeople = ""; 
        String responseCTMPeople = ctmPeopleWsGet(dataCTMPeople);
        System.out.println("Respuesta de ctmPeopleWsGet: " + responseCTMPeople);
        
        
        // Llamar al método ctmPeopleWsGet con el Requestor_By_ID de la respuesta del INC
        String dataCTMPeople = ""; 
        String responseCTMPeople = ctmPeopleWsGet(dataCTMPeople);
        System.out.println("Respuesta de ctmPeopleWsGet: " + responseCTMPeople);
        
        
        // Llamar al método ctmPeopleWsGet con el Assignee_Login_ID de la respuesta del INC
        String dataCTMPeople = ""; 
        String responseCTMPeople = ctmPeopleWsGet(dataCTMPeople);
        System.out.println("Respuesta de ctmPeopleWsGet: " + responseCTMPeople);
        
        
        // Comparar COMITE, AREA Y GERENCIA de la linea 45 vs la linea 50
        // Comparar COMITE, AREA Y GERENCIA de la linea 45 vs la linea 56
        // Comparar COMITE, AREA Y GERENCIA de la linea 45 vs la linea 62 
        
       
        
        // Llamar al método ctmSupportGroupPeople con el Remedy_Login_ID del que se loguea
        // String responseCTMSupportGroup = ctmSupportGroupPeople(userLogueado);
        // System.out.println("Respuesta de ctmSupportGroupPeople: " + responseCTMSupportGroup);

        return fn.respOk(res.getAsJsonObject());
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

}
