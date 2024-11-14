/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.util;

import co.com.claro.myit.api.Const;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.istack.Nullable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Properties;
import javax.validation.constraints.NotNull;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author kompl
 */
public class functions {

    public functions(String path) {
        loadProperties(path);
    }

    public static Gson gson = new Gson();

    public static variable Constanst = new variable();

    public void loadProperties(String path) {
        InputStream inputStream = null;
        try {
            Properties prop = new Properties();

            inputStream = new FileInputStream(new File(path));

            if (inputStream != null) {
                prop.load(inputStream);
            } else {
                throw new FileNotFoundException("property file '" + path + "' not found in the classpath");
            }
            Constanst.setGenericPass(prop.getProperty("GenericPass"));
            Constanst.setGenericUser(prop.getProperty("GenericUser"));
            Constanst.setLoginMyItDir(prop.getProperty("LoginMyItDir"));
            Constanst.setLoginMyItDirAES(prop.getProperty("LoginMyItDirAES"));
            Constanst.setLoginSSODir(prop.getProperty("LoginSSODir"));
            Constanst.setSurveyDir(prop.getProperty("SurveyDir"));
            Constanst.setSurveyDirAES(prop.getProperty("SurveyMyItDirAES"));
            Constanst.setSurveyIncDir(prop.getProperty("SurveyIncDir"));
            Constanst.setSurveyDetailDir(prop.getProperty("SurveyDetailDir"));
            Constanst.setSurveyDetailWODir(prop.getProperty("SurveyDetailWODir"));
            Constanst.setMyItStore(prop.getProperty("MyItStore"));
            Constanst.setMyItUser(prop.getProperty("MyItUser"));
            Constanst.setMyItResolutor(prop.getProperty("MyItResolutor"));
            Constanst.setBannerTime(Integer.parseInt(prop.getProperty("BannerTime")));
            Constanst.setAvatarTime(Integer.parseInt(prop.getProperty("AvatarTime")));
            Constanst.setConsultaReq(prop.getProperty("ConsultaReq"));
            Constanst.setConsultaINC(prop.getProperty("ConsultaINC"));
            Constanst.setConsultaWO(prop.getProperty("ConsultaWO"));
            Constanst.setConsultaNotasINC(prop.getProperty("ConsultaNotasINC"));
            Constanst.setConsultaNotasWO(prop.getProperty("ConsultaNotasWO"));
            Constanst.setCrearNotasINC(prop.getProperty("CrearNotasINC"));
            Constanst.setCrearNotasWO(prop.getProperty("CrearNotasWO"));
            Constanst.setConsultarHR(prop.getProperty("ConsultarHR"));
            Constanst.setCTMPeopleWsGet(prop.getProperty("CTMPeopleWsGet"));
            Constanst.setCTMSupportGroupPeople(prop.getProperty("CTMSupportGroupPeople"));

        } catch (Exception e) {
            System.out.println("Exception: " + e);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException ex) {
                    System.out.println("Exception: " + ex);
                }
            }
        }
    }

    public static <T> T getData(String data, Class<T> clase) {
        JsonElement jsonElement = JsonParser.parseString​(data);
        if (!jsonElement.isJsonObject()) {
            return null;
        }
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        JsonElement dataJson = jsonObject.get("data");
        if (dataJson == null || !dataJson.isJsonObject()) {
            return null;
        }
        return gson.fromJson(dataJson, clase);
    }

    public static String getContent(JsonArray Fields, String key) {
        JsonObject object;
        String clave;
        String result = "";
        for (int i = 0; i < Fields.size(); i++) {
            object = Fields.get(i).getAsJsonObject();
            clave = object.get("key").getAsString();
            if (clave.equals(key)) {
                result = object.get("content").getAsString();
                break;
            }
        }
        return result;
    }

    public static String XmlStringToJsonString(String XmlString, String key) {
        JSONObject jsonElement = new JSONObject();
        try {
            JSONObject jsonObj = XML.toJSONObject(XmlString);
            jsonElement = jsonObj;
            if (!key.equals("")) {
                jsonElement = (JSONObject) jsonObj.get(key);
            }
        } catch (JSONException e) {
            return "";
        }

        return jsonElement.toString(3);
    }

    private static String clearResponse(String res) {
        res = res.replaceAll("soapenv:", "");
        res = res.replaceAll("Soapenv:", "");
        res = res.replaceAll("S:Envelope", "Envelope");
        res = res.replaceAll("s:Envelope", "Envelope");
        res = res.replaceAll("S:Body", "Body");
        res = res.replaceAll("s:Body", "Body");
        res = res.replaceAll("ns0:", "");
        res = res.replaceAll("ns1:", "");
        res = res.replaceAll("getOpResponse", "OpGetResponse");
        return res;
    }

    public static String SoapRequest(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getLoginMyItDir() : Constanst.LoginMyItDirAES);
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapAction);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String RestRequest(String url, String body) {
        String responseString = "";

        try {
            StringEntity xmlBody = new StringEntity(body);
            CloseableHttpClient client = HttpClients.custom().
                    setSSLHostnameVerifier(NoopHostnameVerifier.INSTANCE).setSslcontext(new SSLContextBuilder().loadTrustMaterial(null, new TrustStrategy() {
                public boolean isTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
                    return true;
                }
            }).build()).build();
            HttpPost request = new HttpPost(url);
            request.setHeader("Content-Type", "application/json");

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        } catch (NoSuchAlgorithmException ex) {
            System.out.println(ex.toString());
            return "";
        } catch (KeyStoreException ex) {
            System.out.println(ex.toString());
            return "";
        } catch (KeyManagementException ex) {
            System.out.println(ex.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestSurvey(String body, String action, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body);

            CloseableHttpClient client = HttpClientBuilder.create().build();
            String url = Constanst.getSurveyDir();
            String soapAction = (action.equals("Get")) ? Const.SoapActionSurvey : Const.SoapActionSurveySet;
            if (aes) {
                url = Constanst.getSurveyDirAES();
                soapAction = "";
            }
            HttpPost request = new HttpPost(url);
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", soapAction);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestForDetails(String body, String action) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body);

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((action.equals("GetInc")) ? Constanst.getSurveyIncDir() : (action.equals("GetDetINC")) ? Constanst.getSurveyDetailDir() : Constanst.getSurveyDetailWODir());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", (action.equals("GetInc")) ? Const.SoapActionSurveyIncGet : (action.equals("GetDetINC")) ? Const.SoapActionSurveyDetailGet : Const.SoapActionSurveyDetailWOGet);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static JsonObject getResponse(String data) {
        JsonElement jsonElement = JsonParser.parseString(data);
        if (!jsonElement.isJsonObject()) {
            return null;
        }
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        return jsonObject;
    }

    public static String respError(@Nullable Throwable e, String respuesta, @Nullable Object data) {

        JsonObject res = new JsonObject();
        res.addProperty("isError", true);
        res.addProperty("response", respuesta);
        if (data != null) {
            res.addProperty("data", data.toString());
        }

        try {

            res.addProperty("server", InetAddress.getLocalHost().getHostAddress());
        } catch (UnknownHostException ex) {

        }
        if (e != null) {
            String errTxt = "";
            if (e.getMessage() != null) {
                errTxt = new Gson().toJson(e);
                //res.addProperty("error", );
            } else {
                errTxt = "Error indefinido: " + e;
            }
            errTxt += " Detail:" + e.getLocalizedMessage();
            res.addProperty("errorDetails", e.getMessage() + " || " + e.getCause() + " || " + errTxt);
        }
        return gson.toJson(res);
    }

    public static String respOk(@NotNull Object data) {
        JsonObject res = new JsonObject();
        res.addProperty("isError", false);
        res.add("response", gson.toJsonTree(data));
        try {
            res.addProperty("server", InetAddress.getLocalHost().getHostAddress());
        } catch (UnknownHostException ex) {

        }
        return gson.toJson(res);
    }

    public static String SoapRequestConsutaReq(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getConsultaReq() : Constanst.getConsultaReq());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionConsultaReq);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestConsutaWO(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getConsultaWO() : Constanst.getConsultaWO());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionConsultaWO);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestConsutaNotasWO(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getConsultaNotasWO() : Constanst.getConsultaNotasWO());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionConsultaNotasWO);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestConsutaINC(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getConsultaINC() : Constanst.getConsultaINC());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionConsultaINC);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestConsutaNotasINC(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getConsultaNotasINC() : Constanst.getConsultaNotasINC());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionConsultaNotasINC);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestCrearNotasInc(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getCrearNotasINC() : Constanst.getCrearNotasINC());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionCrearNotasInc);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestCrearNotasWo(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getCrearNotasWO() : Constanst.getCrearNotasWO());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionCrearNotasWo);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestHistoricoRequerimientos(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getConsultarHR(): Constanst.getConsultarHR());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionSRMRequestGetList);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestCTMPeopleGet(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getCTMPeopleWsGet() : Constanst.getCTMPeopleWsGet());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionCTMPeopleGet);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

    public static String SoapRequestCTMSupportGroupPeople(String body, boolean aes) {
        String responseString = "";
        try {

            StringEntity xmlBody = new StringEntity(body, "UTF-8");

            CloseableHttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost((!aes) ? Constanst.getCTMSupportGroupPeople() : Constanst.getCTMSupportGroupPeople());
            request.setHeader("Content-Type", "text/xml");
            request.setHeader("SOAPAction", Const.SoapActionCTMSupportGroupPeopleGetList);

            request.setEntity(xmlBody);
            CloseableHttpResponse response = client.execute(request);
            responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            responseString = clearResponse(responseString);
            System.out.println("Response:");
            System.out.println(responseString);
            response.close();
            client.close();
        } catch (IOException e) {
            System.out.println(e.toString());
            return "";
        }
        return responseString;
    }

}
