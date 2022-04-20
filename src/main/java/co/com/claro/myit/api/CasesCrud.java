/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.db.CasosEntity;
import co.com.claro.myit.db.DetalleCatalogoEntity;
import co.com.claro.myit.db.DocumentosEntity;
import co.com.claro.myit.models.*;
import co.com.claro.myit.service.CasoService;
import co.com.claro.myit.util.OracleUtils;
import co.com.claro.myit.util.functions;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.sql.rowset.serial.SerialBlob;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author JD
 */
@Slf4j
@Path("/casos")
@Produces(MediaType.APPLICATION_JSON)
public class CasesCrud {

    OracleUtils dbUtils;

    @Context
    private ServletContext context;

    private functions fn;

    @POST
    @Path("/crear")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post(String data) {
        log.info("data recibida: {}", data);
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            CaseDataModel datos = functions.getData(data, CaseDataModel.class);
            int id = convertToInt(dbUtils.executeSQL("select count(*) from CasosEntity"));
            id += 1;
            String clrID = "";
            Map<String, Object> params = new HashMap();
            params.put("aplicacion", datos.getAplicacion());
            params.put("servicio", datos.getServicio());
            params.put("lineaServicio", datos.getLineaServicio());
            params.put("tipoFalla", datos.getTipoFalla());
            System.out.println("params "+params);
            List res = dbUtils.readQuery("getCLRID", params);
            String grupo = "";
            if (!res.isEmpty()) {
                System.out.println("res " +res.size());
                Map map = (Map) res.get(0);
                System.out.println("");
                clrID = String.valueOf(map.get("clrID"));
                System.out.println("crlID "+clrID);
                params = new HashMap();
                params.put("id", clrID);
                res = dbUtils.readQuery("getGroup", params);
                if (!res.isEmpty()) {
                    map = (Map) res.get(0);
                     System.out.println("grupo "+map);
                    String automatico = String.valueOf(map.get("automatico"));
                    grupo = String.valueOf(map.get("grupoN1"));
                    if (automatico.equalsIgnoreCase("SI")) {
                        grupo = String.valueOf(map.get("grupoN2"));
                    }
                }
            }

            log.info("Iniciando Asignación de Prioridad ...");
            CasoService service = new CasoService(dbUtils);
            AsignacionPrioridadModel prioridad = null;
            boolean isIncidente = datos.getServicio().equals("Soporte");
            if (isIncidente) {
                // Tipo Incidente
                log.info("Es un Incidente");
                log.info("impacto: {}, urgencia: {}", datos.getImpactoId(), datos.getUrgenciaId());
                prioridad = service
                        .obtenerPrioridadIncidente(clrID, datos.getUsuario(), datos.getImpactoId(), datos.getUrgenciaId());
            } else {
                // Tipo Solicitud
                log.info("No es un Incidente");
                prioridad = service.getBiaAndVip(clrID, datos.getUsuario());
            }

            CasosEntity entity = new CasosEntity().FromModel(datos, id);
            entity.setGRUPOASIGNADO(grupo);

            // !00% Asegurado su llenado
            entity.setUsuarioVIP(prioridad.getUsuarioVip());
            entity.setBia(prioridad.getBia());

            if (isIncidente) {
                entity.setUrgenciaId(prioridad.getUrgenciaId());
                entity.setPrioridadIncidenteId(prioridad.getPrioridadIncidenteId() + "");
                entity.setImpactoId(datos.getImpactoId());
                entity.setUrgenciaId(datos.getUrgenciaId());
            } else entity.setPrioridadSolicitudId("4000");
            log.info("prioridad: {} - {}", entity.getPrioridadIncidenteId(), entity.getPrioridadSolicitudId());
            log.info("Llenado terminado");
            dbUtils.insert(entity);

            if (datos.getDocumentos() != null && !datos.getDocumentos().isEmpty()) {
                DocumentosEntity docEntity = new DocumentosEntity();
                docEntity.setIdCaso(id);
                byte[] decodedByte;
                List<DocumentModel> documents = datos.getDocumentos();
                for (int i = 0; i < documents.size(); i++) {
                    int idDoc = convertToInt(dbUtils.executeSQL("select count(*) from DocumentosEntity"));
                    idDoc += 1;
                    docEntity.setId(idDoc);
                    decodedByte = Base64.getDecoder().decode(documents.get(i).getFile());
                    docEntity.setNombre(documents.get(i).getNombre());
                    try {
                        docEntity.setDocumento(new SerialBlob(decodedByte));
                        dbUtils.insert(docEntity);
                    } catch (SQLException ex) {
                        Logger.getLogger(CasesCrud.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }

            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", "Caso Generado Exitosamente ID: " + entity.getCONSECUTIVO());
            log.info("Caso creado: {} con consecutivo {}", entity.getID(), entity.getCONSECUTIVO());
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/documentos")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_docs(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            CaseScaleModel datos = fn.getData(data, CaseScaleModel.class);
            ArrayList resDb = (ArrayList) dbUtils.readBy("DocumentosEntity", "ID_CASO=" + datos.getIdCaso());
            ArrayList resDoc = new ArrayList();
            DocumentModel docModel;
            DocumentosEntity docEntity = new DocumentosEntity();
            int blobLength;
            for (int i = 0; i < resDb.size(); i++) {
                try {
                    docEntity = (DocumentosEntity) resDb.get(i);
                    blobLength = (int) docEntity.getDocumento().length();
                    byte[] blobAsBytes = docEntity.getDocumento().getBytes(1, blobLength);
                    docModel = new DocumentModel();
                    docModel.setNombre(docEntity.getNombre());
                    docModel.setFile(Base64.getEncoder().encodeToString(blobAsBytes));
                    resDoc.add(docModel);
                } catch (SQLException ex) {
                    Logger.getLogger(CasesCrud.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            JSONObject respuesta = new JSONObject();

            respuesta.put("isError", false);
            respuesta.put("response", resDoc);

            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/gestionar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_gestion(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            CaseGestionModel datos = fn.getData(data, CaseGestionModel.class);
            ArrayList resDb = (ArrayList) dbUtils.readBy("CasosEntity", "ID=" + datos.getIdCaso());
            JSONObject respuesta = new JSONObject();
            if (!resDb.isEmpty()) {
                CasosEntity entity = (CasosEntity) resDb.get(0);
                String nota = datos.getNota() + "," + datos.getUsuario() + "," + datos.getNombreUsuario();
                if (entity.getNOTADETRABAJO() == null) {
                    entity.setNOTADETRABAJO(nota);
                } else {
                    entity.setNOTADETRABAJO(entity.getNOTADETRABAJO() + ";" + nota);
                }

                dbUtils.update(entity);

                if (datos.getDocumentos().size() > 0) {
                    DocumentosEntity docEntity = new DocumentosEntity();
                    docEntity.setIdCaso(datos.getIdCaso());
                    byte[] decodedByte;
                    List<DocumentModel> documents = datos.getDocumentos();
                    for (int i = 0; i < documents.size(); i++) {
                        int idDoc = convertToInt(dbUtils.executeSQL("select count(*) from DocumentosEntity"));
                        idDoc += 1;
                        docEntity.setId(idDoc);
                        decodedByte = Base64.getDecoder().decode(documents.get(i).getFile());
                        docEntity.setNombre(documents.get(i).getNombre());
                        try {
                            docEntity.setDocumento(new SerialBlob(decodedByte));
                            dbUtils.insert(docEntity);
                        } catch (SQLException ex) {
                            Logger.getLogger(CasesCrud.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
                respuesta.put("isError", false);
                respuesta.put("response", "Caso actualizado exitosamente");
            } else {
                respuesta.put("isError", true);
                respuesta.put("response", "Caso no encontrado");
            }

            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/gestionResolutor")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_gestion_resolutor(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            CaseSolvedModel datos = fn.getData(data, CaseSolvedModel.class);
            ArrayList resDb = (ArrayList) dbUtils.readBy("CasosEntity", "ID=" + datos.getID());
            JSONObject respuesta = new JSONObject();
            if (!resDb.isEmpty()) {
                CasosEntity entity = (CasosEntity) resDb.get(0);
                entity.setRESOLUCION(datos.getRESOLUCION());
                String nota = datos.getNOTA() + "," + datos.getUSUARIO() + "," + datos.getNOMBREUSUARIO();
                if (entity.getNOTADETRABAJO() == null) {
                    entity.setNOTADETRABAJO(nota);
                } else {
                    entity.setNOTADETRABAJO(entity.getNOTADETRABAJO() + ";" + nota);
                }
                if (datos.getCODIGODECIERRE() != null) {
                    entity.setCODIGODECIERRE(datos.getCODIGODECIERRE());
                }
                if (datos.getNOMBREANALISTA() != null) {
                    entity.setNOMBREANALISTA(datos.getNOMBREANALISTA());
                }
                if (datos.getUSUARIOANALISTA() != null) {
                    entity.setUSUARIOANALISTA(datos.getUSUARIOANALISTA());
                }

                entity.setESTADO(datos.getESTADO());

                dbUtils.update(entity);

                if (datos.getDOCUMENTOS().size() > 0) {
                    DocumentosEntity docEntity = new DocumentosEntity();
                    docEntity.setIdCaso(datos.getID());
                    byte[] decodedByte;
                    List<DocumentModel> documents = datos.getDOCUMENTOS();
                    for (int i = 0; i < documents.size(); i++) {
                        int idDoc = convertToInt(dbUtils.executeSQL("select count(*) from DocumentosEntity"));
                        idDoc += 1;
                        docEntity.setId(idDoc);
                        decodedByte = Base64.getDecoder().decode(documents.get(i).getFile());
                        docEntity.setNombre(documents.get(i).getNombre());
                        try {
                            docEntity.setDocumento(new SerialBlob(decodedByte));
                            dbUtils.insert(docEntity);
                        } catch (SQLException ex) {
                            Logger.getLogger(CasesCrud.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
                respuesta.put("isError", false);
                respuesta.put("response", "Caso actualizado exitosamente");
            } else {
                respuesta.put("isError", true);
                respuesta.put("response", "Caso no encontrado");
            }

            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    @POST
    @Path("/escalar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_post_scale(String data) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            CaseScaleModel datos = fn.getData(data, CaseScaleModel.class);
            ArrayList resDb = (ArrayList) dbUtils.readBy("CasosEntity", "ID=" + datos.getIdCaso());
            JSONObject respuesta = new JSONObject();
            if (!resDb.isEmpty()) {
                CasosEntity entity = (CasosEntity) resDb.get(0);
                String nota = datos.getNota() + "," + datos.getUsuario() + "," + datos.getNombreUsuario();
                if (entity.getNOTADETRABAJO() == null) {
                    entity.setNOTADETRABAJO(nota);
                } else {
                    entity.setNOTADETRABAJO(entity.getNOTADETRABAJO() + ";" + nota);
                }
                entity.setGRUPOASIGNADO(datos.getGrupo());
                if (datos.getUsuarioAsignado() != null) {
                    entity.setUSUARIOASIGNADO(datos.getUsuarioAsignado());
                }
                dbUtils.update(entity);
                respuesta.put("isError", false);
                respuesta.put("response", "Caso escalado Exitosamente");
            } else {
                respuesta.put("isError", true);
                respuesta.put("response", "Caso no encontrado");
            }

            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }

    public static int convertToInt(Object o) {
        String stringToConvert = String.valueOf(o);
        Long convertedLong = Long.parseLong(stringToConvert);
        return convertedLong.intValue();

    }

}
