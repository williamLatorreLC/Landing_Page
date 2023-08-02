package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.LoginRequest;
import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

/**
 *
 * @author jcabarcas
 */
public class LoginService {

    private final LoginRequest data;

    private functions fn;

    private boolean isContingencia;
    
    public int userProfile=0;

    public LoginService(LoginRequest data, functions fn, boolean isContingencia) {
        this.data = data;
        this.fn = fn;
        this.isContingencia = isContingencia;
    }

    public String login() {
        String body = "";
        if (!this.isContingencia) {
            body = Const.xmlRequestAes;
           
            try {
                body = body.replaceAll("--user--", AES.encryptMethod(this.data.getUser()));
                 body = body.replaceAll("--pass--", AES.encryptMethod(this.data.getPass()));
            } catch (BadPaddingException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (IllegalBlockSizeException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchPaddingException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchAlgorithmException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InvalidAlgorithmParameterException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InvalidKeyException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            }
            System.out.println(body);
        } else {
            body = Const.xmlRequest;
            body = body.replaceAll("--user--", this.data.getUser());
            body = body.replaceAll("--genericUser--", this.data.getUser());
            body = body.replaceAll(Pattern.quote("--genericPass--"), Matcher.quoteReplacement(this.data.getPass()));
            System.out.println(body);
        }

        return this.fn.SoapRequest(body, !this.isContingencia);
    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();
        if (!this.isContingencia) {
            try {
                respuesta=respuesta.get("return").getAsJsonObject();
                res.addProperty("First_Name", (respuesta.has("firstName")) ? AES.decryptMethod(respuesta.get("firstName").getAsString()) : "");
                res.addProperty("Last_Name", (respuesta.has("lastName")) ?  AES.decryptMethod(respuesta.get("lastName").getAsString()) : "");
                res.addProperty("Support_Staff", (respuesta.has("supportStaff")) ?  AES.decryptMethod(respuesta.get("supportStaff").getAsString()) : "");
                res.addProperty("Organization", (respuesta.has("organizacion")) ?  AES.decryptMethod(respuesta.get("organizacion").getAsString()) : "");
                res.addProperty("Profile_Status", (respuesta.has("profileStatus")) ?  AES.decryptMethod(respuesta.get("profileStatus").getAsString()) : "");
                res.addProperty("Departament", (respuesta.has("departament")) ?  AES.decryptMethod(respuesta.get("departament").getAsString()).replaceAll("&(?!amp;)", "") : "");
                res.addProperty("Job_Title", (respuesta.has("jobTitle")) ?  AES.decryptMethod(respuesta.get("jobTitle").getAsString()).replaceAll("&(?!amp;)", "") : "No disponible");
                res.addProperty("Internet_Email", (respuesta.has("internetEmail")) ?  AES.decryptMethod(respuesta.get("internetEmail").getAsString()) : "");
                res.addProperty("Site", (respuesta.has("site")) ?  AES.decryptMethod(respuesta.get("site").getAsString()) : "");
                userProfile = (respuesta.has("userProfile")) ?  Integer.parseInt(AES.decryptMethod(respuesta.get("userProfile").getAsString())): 0;
            } catch (BadPaddingException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (IllegalBlockSizeException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchPaddingException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchAlgorithmException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InvalidAlgorithmParameterException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InvalidKeyException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            res.addProperty("First_Name", (respuesta.has("First_Name")) ? respuesta.get("First_Name").getAsString() : "");
            res.addProperty("Last_Name", (respuesta.has("Last_Name")) ? respuesta.get("Last_Name").getAsString() : "");
            res.addProperty("Support_Staff", (respuesta.has("Support_Staff")) ? respuesta.get("Support_Staff").getAsString() : "");
            res.addProperty("Organization", (respuesta.has("Organization")) ? respuesta.get("Organization").getAsString() : "");
            res.addProperty("Profile_Status", (respuesta.has("Profile_Status")) ? respuesta.get("Profile_Status").getAsString() : "");
            res.addProperty("Departament", (respuesta.has("Departament")) ? respuesta.get("Departament").getAsString().replaceAll("&(?!amp;)", "") : "");
            res.addProperty("Job_Title", (respuesta.has("Job_Title")) ? respuesta.get("Job_Title").getAsString().replaceAll("&(?!amp;)", "") : "No disponible");
            res.addProperty("Internet_Email", (respuesta.has("Internet_Email")) ? respuesta.get("Internet_Email").getAsString() : "");
            res.addProperty("Site", (respuesta.has("Site")) ? respuesta.get("Site").getAsString() : "");
            userProfile = (respuesta.has("User_profile")) ? respuesta.get("User_profile").getAsInt() : 0;
        }
        res.addProperty("ProfileId", String.valueOf(userProfile));

        return res;
    }

}
