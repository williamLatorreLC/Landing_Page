package co.com.claro.myit.api;

import co.com.claro.myit.db.InactividadEntity;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import java.util.List;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.json.JSONException;
import org.json.JSONObject;

@Path("/verificarControlInactividad")
@Produces(MediaType.APPLICATION_JSON)
public class Inactividad {

    MySqlUtils dbUtils;
    private functions fn;

    @Context
    private ServletContext context;

    @GET
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get() {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db.properties"));
        try {
            List res = dbUtils.read("InactividadEntity");
            JSONObject respuesta = new JSONObject();
            JSONObject status = new JSONObject();

            if (!res.isEmpty()) {
                for (Object obj : res) {
                    JSONObject item = new JSONObject(obj);
                    if (item.has("tipo")) {
                        status.put(item.getString("tipo"), item.getInt("estado"));
                        status.put("id" + item.getString("tipo"), item.getInt("id"));
                    }
                }
            } else {
                status.put("message", "No hay datos disponibles");
            }

            respuesta.put("isError", false);
            respuesta.put("response", status);
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }


}
