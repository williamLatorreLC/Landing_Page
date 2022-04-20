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
import java.util.List;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.json.JSONException;
import org.json.JSONObject;

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
