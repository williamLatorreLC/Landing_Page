/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

/**
 *
 * @author kompl
 */
import co.com.claro.myit.db.BannerEntity;
import co.com.claro.myit.models.BannerModel;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;


//Ruta Servioo REST Banners
@Path("/banners")
@Produces(MediaType.APPLICATION_JSON)
public class Banner {

    MySqlUtils dbUtils;
    
      
    @Context
    private ServletContext context;
    
    
    private functions fn;
    
    

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post(String data) throws JSONException {
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        try {
            BannerModel datos = fn.getData(data, BannerModel.class);
            BannerEntity banner = new BannerEntity(datos.getRuta());
            dbUtils.insert(banner);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Banner creado correctamente.");
            return respuesta.toString();
        } catch (Exception e) {
            return fn.respError(e, "Error al crear banner por favor intentalo nuevamente.", data);
        }
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_put(String data) {
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        try {
            BannerModel datos = fn.getData(data, BannerModel.class);
            BannerEntity banner = new BannerEntity(datos.getId(), datos.getRuta(), datos.getEstado());
            dbUtils.update(banner);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Banner modificado correctamente.");
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al modificar banner por favor intentalo nuevamente.", data);
        }
    }

    @DELETE
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_delete(@PathParam("id") int id) {
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        try {
            BannerEntity banner = new BannerEntity();
            banner.setId(id);
            dbUtils.delete(banner);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Banner eliminado correctamente.");
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al eliminar banner por favor intentalo nuevamente.", id);
        }
    }

    @GET
    @Path("/{estado}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get(@PathParam("estado") String estado) {
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        try {
            List res = null;
            if (estado.equals("all")) {
                res = dbUtils.read("BannerEntity");
            } else {
                res = dbUtils.readBy("BannerEntity", "estado=" + estado);
            }
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", res);
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al obtener datos.", estado);
        }
    }

}
