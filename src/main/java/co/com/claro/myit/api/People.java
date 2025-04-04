/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.OracleUtils;
import co.com.claro.myit.util.functions;
import com.unboundid.ldap.sdk.LDAPConnection;
import com.unboundid.ldap.sdk.LDAPException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.JSONException;
import org.json.JSONObject;

@Path("/people")
@Produces(MediaType.APPLICATION_JSON)
public class People {

    OracleUtils dbUtils;

    @Context
    private ServletContext context;

    private functions fn;

    private final String LDAP_HOST = "172.24.232.140";
    private final int LDAP_PORT = 389; // 636
    private final String BASE_DN = "DC=claro,DC=co";

    @GET
    @Path("/{estado}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get(@PathParam("estado") String estado) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            List res = dbUtils.read("CTMPeopleEntity");
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", res);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", estado);
        }
    }

    @POST
    @Path("/auth")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response authenticate(Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        String userDN = username;

        try {
            LDAPConnection connection = new LDAPConnection(LDAP_HOST, LDAP_PORT, userDN, password);

            // Se realiza la búsqueda del usuario en LDAP
            String searchBase = BASE_DN;
            String searchFilter = "(userPrincipalName=" + userDN + ")";
            com.unboundid.ldap.sdk.SearchResult searchResult
                    = connection.search(searchBase, com.unboundid.ldap.sdk.SearchScope.SUB, searchFilter);

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("authenticated", true);

            if (!searchResult.getSearchEntries().isEmpty()) {
                com.unboundid.ldap.sdk.SearchResultEntry entry = searchResult.getSearchEntries().get(0);

                System.out.println("=== Atributos completos del usuario ===");
                Collection<com.unboundid.ldap.sdk.Attribute> attributes = entry.getAttributes();
                for (com.unboundid.ldap.sdk.Attribute attr : attributes) {
                    String name = attr.getName();
                    String[] values = attr.getValues();
                    System.out.print(name + ": ");
                    for (int j = 0; j < values.length; j++) {
                        System.out.print(values[j]);
                        if (j < values.length - 1) {
                            System.out.print(", ");
                        }
                    }
                    System.out.println();
                }
                System.out.println("=======================================");

                // Se extraen los atributos retornados por LDAP
                String firstName = entry.getAttributeValue("givenName");
                String lastName = entry.getAttributeValue("sn");
                String userAccountControl = entry.getAttributeValue("userAccountControl");
                String organization = entry.getAttributeValue("company");
                String department = entry.getAttributeValue("department");
                String jobTitle = entry.getAttributeValue("title");
                String remedyLoginID = entry.getAttributeValue("sAMAccountName");
                String internetEmail = entry.getAttributeValue("mail");
                String displayName = entry.getAttributeValue("displayName");
                String managerAttr = entry.getAttributeValue("manager");

                // Mapeo de atributos al JSON usando los datos que retorna LDAP
                jsonResponse.put("First_Name", firstName != null ? firstName : JSONObject.NULL);
                jsonResponse.put("Last_Name", lastName != null ? lastName : JSONObject.NULL);
                if (userAccountControl != null) {
                    jsonResponse.put("Profile_Status", userAccountControl.equals("512") ? "Enabled" : "Disabled");
                } else {
                    jsonResponse.put("Profile_Status", JSONObject.NULL);
                }
                // Atributos que no se encuentran en LDAP se asignan como nulos
                jsonResponse.put("Support_Staff", entry.getAttributeValue("supportStaff") != null ? entry.getAttributeValue("supportStaff") : JSONObject.NULL);
                jsonResponse.put("Organization", organization != null ? organization : JSONObject.NULL);
                jsonResponse.put("Departament", department != null ? department : JSONObject.NULL);
                jsonResponse.put("Job_Title", jobTitle != null ? jobTitle : JSONObject.NULL);
                jsonResponse.put("Remedy_Login_ID", remedyLoginID != null ? remedyLoginID : JSONObject.NULL);
                jsonResponse.put("Internet_Email", internetEmail != null ? internetEmail : JSONObject.NULL);
                jsonResponse.put("User_profile", entry.getAttributeValue("userProfile") != null ? entry.getAttributeValue("userProfile") : JSONObject.NULL);
                jsonResponse.put("Site", entry.getAttributeValue("site") != null ? entry.getAttributeValue("site") : JSONObject.NULL);
                jsonResponse.put("Region", entry.getAttributeValue("region") != null ? entry.getAttributeValue("region") : JSONObject.NULL);
                jsonResponse.put("Site_Group", entry.getAttributeValue("siteGroup") != null ? entry.getAttributeValue("siteGroup") : JSONObject.NULL);
                jsonResponse.put("Local_Business", entry.getAttributeValue("localBusiness") != null ? entry.getAttributeValue("localBusiness") : JSONObject.NULL);
                jsonResponse.put("Embajador", entry.getAttributeValue("embajador") != null ? entry.getAttributeValue("embajador") : JSONObject.NULL);
                jsonResponse.put("VIPt", entry.getAttributeValue("VIPt") != null ? entry.getAttributeValue("VIPt") : JSONObject.NULL);

                // Extraer ManagersName a partir del atributo manager (formato CN=Nombre,...)
                if (managerAttr != null && managerAttr.startsWith("CN=")) {
                    int endIndex = managerAttr.indexOf(",");
                    String managersName = managerAttr.substring(3, endIndex > 0 ? endIndex : managerAttr.length());
                    jsonResponse.put("ManagersName", managersName);
                } else {
                    jsonResponse.put("ManagersName", JSONObject.NULL);
                }
                jsonResponse.put("ManagerLoginID", entry.getAttributeValue("managerLoginID") != null ? entry.getAttributeValue("managerLoginID") : JSONObject.NULL);
                jsonResponse.put("Full_Name", displayName != null ? displayName : JSONObject.NULL);
            }

            connection.close();
            return Response.ok(jsonResponse.toString(), MediaType.APPLICATION_JSON).build();

        } catch (LDAPException e) {
            JSONObject error = new JSONObject();
            try {
                error.put("authenticated", false);
                error.put("error", e.getExceptionMessage());
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
            return Response.status(Response.Status.UNAUTHORIZED).entity(error.toString()).build();
        } catch (JSONException ex) {
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}
