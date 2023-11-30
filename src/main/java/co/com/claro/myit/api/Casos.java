/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import co.com.claro.myit.db.UserSessionEntity;
import co.com.claro.myit.service.ConsultaCasosService;
import co.com.claro.myit.service.LoginService;
import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import javax.servlet.ServletContext;
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
@Path("/casos")
public class Casos {
    
    @Context
    private ServletContext context;
    
    private functions fn;
    
    
    @POST
    @Produces("application/json")
    public String consultarRequerimiento(String data) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        
        ConsultaRequerimientoRequest datos = fn.getData(data, ConsultaRequerimientoRequest.class);
       
        ConsultaCasosService consultaCasosService= new ConsultaCasosService(datos, fn);
        
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());
                
        return "OK";
    }
    
}
