/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.models.ConsultModel;
import co.com.claro.myit.models.ServiceModel;
import co.com.claro.myit.util.OracleUtils;
import co.com.claro.myit.util.functions;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * @author JD
 */
@Slf4j
@Path("/listaCasos")
@Produces(MediaType.APPLICATION_JSON)
public class CasesList {

    OracleUtils dbUtils;

    @Context
    private ServletContext context;

    private functions fn;

    @POST
    @Path("/usuario")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post(String data) {
        log.info("dataUsuario: {}: ", data);
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            System.out.println("Iincio Operacion");
            ConsultModel datos = fn.getData(data, ConsultModel.class);
            System.out.println("Datos Recibidos");
            System.out.println(data);
            String conditional = "USUARIO = '" + datos.getUsuario() + "'";
            List res = dbUtils.readBy("SolucionViewEntity", conditional);
            System.out.println("Lista DB");
            System.out.println(res);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", res);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/buscar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_search(String data) {
        log.info("dataUsuario: {}: ", data);
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            System.out.println("Iincio Operacion");
            ConsultModel datos = fn.getData(data, ConsultModel.class);
            ArrayList result = new ArrayList();
            if (datos.getCriterio() != null) {
                if(datos.getCriterio().toUpperCase().contains("LANREQ")){
                    result = (ArrayList) dbUtils.readBy("SolucionViewEntity", "CONSECUTIVO='" + datos.getCriterio() + "' OR CONSECUTIVO LIKE '%" + datos.getCriterio() + "%'");
                }else{
                    result = (ArrayList) dbUtils.readBy("SolucionViewEntity", "CONSECUTIVO LIKE '%LANREQ%" + datos.getCriterio() + "'");
                }
            }
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", result);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/resolutor")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_resolutor(String data) {
        log.info("dataUsuario: {}: ", data);
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            ConsultModel datos = fn.getData(data, ConsultModel.class);
            String conditional = "USUARIO = '" + datos.getUsuario() + "' OR USUARIOASIGNADO = '" + datos.getUsuario() + "'";
            boolean full = false;
            for (int i = 0; i < datos.getGrupos().size(); i++) {
                if (String.valueOf(datos.getGrupos().get(i)).equals("COL-IT-GMSC-SOPORTE-SITIO-MOVIL")
                        || String.valueOf(datos.getGrupos().get(i)).equals("COL-IT-GMSC-N1-MESA MOVIL NIVEL 1")
                        || String.valueOf(datos.getGrupos().get(i)).equals("COL-IT-GMSC-CALIDAD")) {
                    full = true;
                }
                conditional += " OR  GRUPOASIGNADO='" + String.valueOf(datos.getGrupos().get(i)) + "'";
            }
            System.out.println(conditional);
            List<?> res;
            if (full) {
                res = dbUtils.readBy("SolucionViewEntity", "ESTADO<>3000");
            } else {
                res = dbUtils.readBy("SolucionViewEntity", conditional);
            }
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", res);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }
}
