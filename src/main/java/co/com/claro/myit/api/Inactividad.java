package co.com.claro.myit.api;

import co.com.claro.myit.db.InactividadEntity;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
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
