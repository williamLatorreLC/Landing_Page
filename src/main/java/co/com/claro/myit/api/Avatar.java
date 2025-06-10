/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.db.AvatarEntity;
import co.com.claro.myit.models.AvatarModel;
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
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import jakarta.ws.rs.Produces;
import org.json.JSONException;
import org.json.JSONObject;
/**
 *
 * @author kompl
 */
@Path("/avatars")
@Produces(MediaType.APPLICATION_JSON)
public class Avatar{
    
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
            AvatarModel datos = fn.getData(data, AvatarModel.class);
            AvatarEntity avatar = new AvatarEntity(datos.getImagen());
            dbUtils.insert(avatar);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Avatar creado correctamente.");
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al crear avatar por favor intentalo nuevamente.", data);
        }
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_put(String data) {
         fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        try {
            AvatarModel datos = fn.getData(data, AvatarModel.class);
            AvatarEntity avatar = new AvatarEntity(datos.getId(), datos.getImagen(), datos.getEstado());
            dbUtils.update(avatar);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Avatar modificado correctamente.");
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al modificar avatar por favor intentalo nuevamente.", data);
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
            AvatarEntity avatar = new AvatarEntity();
            avatar.setId(id);
            dbUtils.delete(avatar);
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Avatar eliminado correctamente.");
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al eliminar avatar por favor intentalo nuevamente.", id);
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
                res = dbUtils.read("AvatarEntity");
            } else {
                res = dbUtils.readBy("AvatarEntity", "estado=" + estado);
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
