/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.models.CaseScaleModel;
import co.com.claro.myit.models.ServiceModel;
import co.com.claro.myit.util.OracleUtils;
import co.com.claro.myit.util.functions;
import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author JD
 */
@Path("/obtenerListas")
@Produces(MediaType.APPLICATION_JSON)
public class GenericList {

    OracleUtils dbUtils;

    @Context
    private ServletContext context;

    private functions fn;

    @GET
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get() {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            Map<String, Object> params = new HashMap();
            List res = dbUtils.readQuery("Sedes.listUniques", params);
            List res2 = dbUtils.readQuery("LineaServicios.listUniques", params);
            JSONObject respuesta = new JSONObject();
            JSONObject listas = new JSONObject();
            listas.put("sedes", res);
            listas.put("lineasServicios", res2);
            respuesta.put("isError", false);
            respuesta.put("response", listas);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @GET
    @Path("/organizaciones")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get_org() {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            Map<String, Object> params = new HashMap();
            List res = dbUtils.readQuery("Soporte.listOrganizations", params);
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
    @Path("/grupos")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_org(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            ServiceModel datos = fn.getData(data, ServiceModel.class);
            Map<String, Object> params = new HashMap();
            params.put("organizacion", datos.getOrganizacion());
            List res = dbUtils.readQuery("Soporte.findByOrganization", params);
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
    @Path("/servicios")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_services(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {

            ServiceModel datos = fn.getData(data, ServiceModel.class);

            Map<String, Object> params = new HashMap();
            params.put("lineaServicio", datos.getLineaServicio());
            List res = dbUtils.readQuery("Servicios.findByServiceLine", params);
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
    @Path("/aplicaciones")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_apps(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {

            ServiceModel datos = fn.getData(data, ServiceModel.class);

            Map<String, Object> params = new HashMap();
            params.put("lineaServicio", datos.getLineaServicio());
            String queryName = "Aplicaciones.findByServiceLine";
            if (datos.getServicio() != null) {
                params.put("servicio", datos.getServicio());
                queryName = "Aplicaciones.findByServiceLineAndService";
            }

            List res = dbUtils.readQuery(queryName, params);
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
    @Path("/tipos")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_list(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            ServiceModel datos = fn.getData(data, ServiceModel.class);
            Map<String, Object> params = new HashMap();
            params.put("aplicacion", datos.getAplicacion());
            params.put("servicio", datos.getServicio());
            params.put("lineaServicio", datos.getLineaServicio());
            List fallas = dbUtils.readQuery("TipoFalla.findByAplicacionServiceAndServiceLine", params);
            params = new HashMap<>();
            params.put("estado", 1); // 1 = Activo
            List operaciones = dbUtils.readNamedQuery("TipoOperacion.findAll", params);
            List usuarios = dbUtils.readNamedQuery("TipoCliente.findAll", params);
            List<?> impactos = dbUtils.read("TipoImpactoEntity");
            List<?> estados = dbUtils.read("EstadoEntity");
            List<?> codigoCierres = dbUtils.read("CodigoCierreEntity");

            JSONObject respuesta = new JSONObject();
            JSONObject listas = new JSONObject();
            listas.put("fallas", fallas);
            listas.put("operaciones", operaciones);
            listas.put("usuarios", usuarios);
            listas.put("impactos", impactos);
            listas.put("estados", estados);
            listas.put("codigoCierres", codigoCierres);
            respuesta.put("isError", false);
            respuesta.put("response", listas);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/parametrizacion")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_solvedParams(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            ServiceModel datos = fn.getData(data, ServiceModel.class);
            Map<String, Object> params = new HashMap();
            params.put("aplicacion", datos.getAplicacion());
            params.put("servicio", datos.getServicio());
            params.put("lineaServicio", datos.getLineaServicio());
            params.put("tipoFalla", datos.getTipoFalla());
            ArrayList resDb = (ArrayList) dbUtils.readQuery("gerPrerequisitesAMX", params);
            List<?> estados = dbUtils.read("EstadoEntity");
            List<?> codigoCierres = dbUtils.read("CodigoCierreEntity");

            JSONObject respuesta = new JSONObject();
            JSONObject listas = new JSONObject();
            listas.put("prerequisitos", resDb.get(0));
            listas.put("estados", estados);
            listas.put("codigoCierres", codigoCierres);
            respuesta.put("isError", false);
            respuesta.put("response", listas);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/miembros")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_userGroups(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            CaseScaleModel datos = fn.getData(data, CaseScaleModel.class);
            JSONObject respuesta = new JSONObject();
            List res = dbUtils.readBy("SupportGroupMembersEntity", "idGrupo='" + datos.getIdGrupo() + "'");
            respuesta.put("isError", false);
            respuesta.put("response", res);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/tipoUrgencias")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String listarUrgenciasBy(Map<String, Map<String, Object>> data) {
        Map<String, Object> conditionalRequest = data.get("data");
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        JSONObject response = new JSONObject();

        if (conditionalRequest.isEmpty()) {
            response.put("isError", true);
            response.put("response", "bad request");
            return response.toString();
        }

        String username = conditionalRequest.get("usuario") + "";
        String aplicacion = conditionalRequest.get("aplicacion") + "";
        String tipoFalla = conditionalRequest.get("tipoFalla") + "";
        String servicio = conditionalRequest.get("servicio") + "";
        String lineaServicio = conditionalRequest.get("lineaServicio") + "";

        String comparative = "<>";

        if (username.isEmpty() || aplicacion.isEmpty() || lineaServicio.isEmpty() || servicio.isEmpty() || tipoFalla.isEmpty()) {
            response.put("isError", true);
            response.put("response", "bad request");
        } else {
            Map<String, Object> params = new HashMap<>();
            params.put("aplicacion", aplicacion);
            params.put("lineaServicio", lineaServicio);
            params.put("servicio", servicio);
            params.put("tipoFalla", tipoFalla);

            ArrayList resDB = (ArrayList) dbUtils.readQuery("gerPrerequisitesAMX", params);

            String clrId = String.valueOf(dbUtils.readQuery("getCLRID", params).get(0));

            String queryVIP = String.format("select p.vip from CTMPeopleEntity p where p.remedyID = '%s'", username);
            String queryBIA = String.format("select d.bia from DetalleCatalogoEntity d where d.id = '%s'", clrId);

            Integer vip = (Integer) dbUtils.executeSQL(queryVIP);
            String bia = String.valueOf(dbUtils.executeSQL(queryBIA));

            if (bia.equals("SI") || vip == 0) {
                comparative = "=";
            }

            List<?> urgencias = dbUtils.readBy("TipoUrgenciaEntity", "id" + comparative + "4000");

            response.put("isError", false);
            response.put("response", urgencias);
            response.put("prerequisitos", "");
            if (!resDB.isEmpty()) {
                response.put("prerequisitos", resDB.get(0));
            }

        }
        return response.toString();
    }
}
