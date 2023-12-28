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

    public static final String xmlRequestAes = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
            + "    <Header>\n"
            + "        <HeaderRequest xmlns=\"http://soap.cusprob.claro.com.co/\">\n"
            + "            <user xmlns=\"\">--user--</user>\n"
            + "            <password xmlns=\"\">--pass--</password>\n"
            + "        </HeaderRequest>\n"
            + "    </Header>\n"
            + "    <Body>\n"
            + "        <getOp xmlns=\"http://soap.cusprob.claro.com.co/\">\n"
            + "            <GetOpRequest xmlns=\"\">\n"
            + "                <remedyLoginId>--user--</remedyLoginId>\n"
            + "            </GetOpRequest>\n"
            + "        </getOp>\n"
            + "    </Body>\n"
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

    /* Consulta de Requerimientos*/
    public static final String SoapActionConsultaReq = "urn:SRM_Request/Get";

    public static String xmlRequestConsultaReq = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:SRM_Request\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:Get>"
            + "      <urn:Service_Request_Number>--req--</urn:Service_Request_Number>"
            + "    </urn:Get>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";

    /* Consulta de Work Order*/
    public static final String SoapActionConsultaWO = "urn:WOI_WorkOrder_WS/Get";

    public static String xmlRequestConsultaWO = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:WOI_WorkOrder_WS\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:Get>"
            + "      <urn:Work_Order_Number>--wo--</urn:Work_Order_Number>"
            + "    </urn:Get>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";

    /* Consulta de INC*/
    public static final String SoapActionConsultaINC = "urn:HPD_HelpDesk_WS/Get";

    public static String xmlRequestConsultaINC = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:HPD_HelpDesk_WS\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:Get>"
            + "      <urn:Incident_Number>--inc--</urn:Incident_Number>"
            + "    </urn:Get>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";

    /* Consulta notas de INC*/
    public static final String SoapActionConsultaNotasINC = "urn:HPD_WorkLog/GetList";

    public static String xmlRequestConsultaNotasINC = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:HPD_WorkLog\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:GetList>"
            + "      <urn:Incident_Number>--inc--</urn:Incident_Number>"
            + "    </urn:GetList>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";

    public static final String SoapActionConsultaNotasWO = "urn:WOI_WorkInfo/GetList";

    public static String xmlRequestNotasConsultaWO = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:WOI_WorkInfo\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:GetList>"
            + "      <urn:Work_Order_ID>--wo--</urn:Work_Order_ID>"
            + "    </urn:GetList>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";

    /* Crear notas de INC*/
    public static final String SoapActionCrearNotasInc = "urn:HPD_WorkLog/Add_WorkInfo";

    public static String xmlRequestCrearNotasInc = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:HPD_WorkLog\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:Add_WorkInfo>"
            + "      <urn:Incident_Number>--inc--</urn:Incident_Number>"
            + "      <urn:Work_Log_Submitter>--submitter--</urn:Work_Log_Submitter>"
            + "      <urn:Work_Log_Type>--logtype--</urn:Work_Log_Type>"
            + "      <!--Optional:-->"
            + "      <urn:Detailed_Description>--detailed--</urn:Detailed_Description>"
            + "      <urn:View_Access></urn:View_Access>"
            + "      <urn:Secure_Work_Log>Yes</urn:Secure_Work_Log>"
            + "      <!--Optional:-->"
            + "      <urn:WorkInfoAttachment1Name>--Attachment1Name--</urn:WorkInfoAttachment1Name>"
            + "      <!--Optional:-->"
            + "      <urn:WorkInfoAttachment1Data>--Attachment1Data--</urn:WorkInfoAttachment1Data>"
            + "      <!--Optional:-->"
            + "      <urn:WorkInfoAttachment1OrigSize></urn:WorkInfoAttachment1OrigSize>"
            + "    </urn:Add_WorkInfo>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";

    /* Crear notas de WO*/
    public static final String SoapActionCrearNotasWo = "urn:WOI_WorkInfo/Add_WorkInfo";

    public static String xmlRequestCrearNotasWo = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:WOI_WorkInfo\">"
            + " <soapenv:Header>"
            + "    <urn:AuthenticationInfo>"
            + "        <urn:userName>matilda.claro</urn:userName>"
            + "        <urn:password>Claro2018*</urn:password>"
            + "        <!--Optional:-->"
            + "        <urn:authentication>?</urn:authentication>"
            + "        <!--Optional:-->"
            + "        <urn:locale>?</urn:locale>"
            + "        <!--Optional:-->"
            + "        <urn:timeZone>?</urn:timeZone>"
            + "    </urn:AuthenticationInfo>"
            + "  </soapenv:Header>"
            + "  <soapenv:Body>"
            + "    <urn:Add_WorkInfo>"
            + "      <!--Optional:-->"
            + "      <urn:Work_Order_ID>--wo--</urn:Work_Order_ID>"
            + "      <!--Optional:-->"
            + "      <urn:WorkOrder_EntryID></urn:WorkOrder_EntryID>"
            + "      <urn:Work_Log_Submitter>--submitter--</urn:Work_Log_Submitter>"
            + "      <!--Optional:-->"
            + "      <urn:Detailed_Description>--detailed--</urn:Detailed_Description>"
            + "      <urn:View_Access>Internal</urn:View_Access>"
            + "      <urn:Secure_Work_Log>Yes</urn:Secure_Work_Log>"
            + "      <!--Optional:-->"
            + "      <urn:WorkInfoAttachment1Name>--Attachment1Name--</urn:WorkInfoAttachment1Name>"
            + "      <!--Optional:-->"
            + "      <urn:WorkInfoAttachment1Data>--Attachment1Data--</urn:WorkInfoAttachment1Data>"
            + "      <!--Optional:-->"
            + "      <urn:WorkInfoAttachment1OrigSize></urn:WorkInfoAttachment1OrigSize>"
            + "      <urn:Work_Log_Type>--logtype--</urn:Work_Log_Type>"
            + "    </urn:Add_WorkInfo>"
            + "  </soapenv:Body>"
            + "</soapenv:Envelope>";
}
