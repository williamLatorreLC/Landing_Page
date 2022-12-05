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
public class Const {
    
    public Const() {
    }

    public static final String SoapAction = "urn:CTM_People_WS/OpGet";

    public static final String SoapActionSurvey = "urn:SRM_Survey/GetList";

    public static final String SoapActionSurveySet = "urn:SRM_Survey/Set";
    
    public static final String SoapActionSurveyIncGet = "urn:SRM_Request/Get";
    
    public static final String SoapActionSurveyDetailGet = "urn:HPD_HelpDesk_WS/Get";
    
    public static final String SoapActionSurveyDetailWOGet = "urn:WOI_WorkOrder_WS/Get";

    public static final String xmlRequest = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">"
            + "<Header>"
            + " <AuthenticationInfo xmlns=\"urn:CTM_People_WS\">"
            + "     <userName>--genericUser--</userName>"
            + "     <password><![CDATA[--genericPass--]]></password>"
            + " </AuthenticationInfo>"
            + "</Header>"
            + "<Body>"
            + " <OpGet xmlns=\"urn:CTM_People_WS\">"
            + "     <Remedy_Login_ID>--user--</Remedy_Login_ID>"
            + " </OpGet>"
            + "</Body>"
            + "</Envelope>";

    public static final String SAMLRequest = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            + "<samlp:AuthnRequest xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\"\n"
            + "                    xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\"\n"
            + "ID=\"--ID--\"\n"
            + "Version=\"2.0\"\n"
            + "ProviderName=\"ClaroColombia\"\n"
            + "IssueInstant=\"--FECHA--\"\n"
            + "Destination=\"https://labmobileid.telcel.com:9070\"\n"
            + "ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\"\n"
            + "AssertionConsumerServiceURL=\"http://labmobileid.telcel.com:9015/callback/catcher\">\n"
            + "  <saml:Issuer>lndpage</saml:Issuer>\n"
            + "  <samlp:NameIDPolicy\n"
            + "    Format=\"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress\"\n"
            + "    AllowCreate=\"true\"/>\n"
            + "  <samlp:RequestedAuthnContext Comparison=\"exact\">\n"
            + "    <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>\n"
            + "  </samlp:RequestedAuthnContext>\n"
            + "</samlp:AuthnRequest>";

    public static final String LogOutRequest = "<samlp:LogoutRequest xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\"\n"
            + "                    xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\"\n"
            + "ID=\"--AuthnRequestID--\"\n"
            + "Version=\"2.0\"\n"
            + "IssueInstant=\"--FECHA--\"\n"
            + "Destination=\"https://labmobileid.telcel.com:9070\"\n"
            + "ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\"\n"
            + "AssertionConsumerServiceURL=\"http://labmobileid.telcel.com:9015/callback/catcher\">\n"
            + "  <saml:Issuer>lndpage</saml:Issuer>\n"
            + "  <samlp:NameID SPNameQualifier=\"Claro Colombia\"\n"
            + "    Format=\"urn:oasis:names:tc:SAML:2.0:nameid-format:transient\">--AssertionID--</samlp:NameID>\n"
            + "</samlp:LogoutRequest>";

    
}
