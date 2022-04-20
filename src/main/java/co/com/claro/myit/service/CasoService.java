package co.com.claro.myit.service;

import co.com.claro.myit.db.PrioridadIncidentesEntity;
import co.com.claro.myit.models.AsignacionPrioridadModel;
import co.com.claro.myit.util.OracleUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CasoService {
    private final OracleUtils dbUtils;

    public CasoService(OracleUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    public AsignacionPrioridadModel getBiaAndVip(String clrId, String username) {
        String queryVIP = String.format("select p.vip from CTMPeopleEntity p where p.remedyID = '%s'", username);
        String queryBIA = String.format("select d.bia from DetalleCatalogoEntity d where d.id = '%s'", clrId);

        Integer vip = (Integer) dbUtils.executeSQL(queryVIP);
        String bia = String.valueOf(dbUtils.executeSQL(queryBIA));

        AsignacionPrioridadModel asignacionPrioridad = new AsignacionPrioridadModel();
        asignacionPrioridad.setBia(bia);
        asignacionPrioridad.setUsuarioVip(vip);

        return asignacionPrioridad;
    }

    public AsignacionPrioridadModel obtenerPrioridadIncidente(String clrId, String username, String impactoId, String urgenciaId) {
        // se supone que el servicio es "Soporte".
        log.info("Tipo incidencia: Falla");
        String queryVIP = String.format("select p.vip from CTMPeopleEntity p where p.remedyID = '%s'", username);
        String queryBIA = String.format("select d.bia from DetalleCatalogoEntity d where d.id = '%s'", clrId);

        Integer vip = (Integer) dbUtils.executeSQL(queryVIP);
        String bia = String.valueOf(dbUtils.executeSQL(queryBIA));
        log.info("se obtuvo los VIP and BIA");

        if (bia.equals("SI") || vip == 1) urgenciaId = "4000";

        log.info("error al llamar el metodo privado");
        AsignacionPrioridadModel asignacionPrioridad = obtenerPrioridadIncidente(impactoId, urgenciaId);
        asignacionPrioridad.setBia(bia);
        asignacionPrioridad.setUsuarioVip(vip);

        return asignacionPrioridad;
    }

    private AsignacionPrioridadModel obtenerPrioridadIncidente(String impactoId, String urgenciaId) {
        String impacto;
        String urgencia;
        log.info("frag 0, {},{}", impactoId, urgenciaId);

        String queryImpacto = String.format("select t.tipo from TipoImpactoEntity t where t.id = '%s'", impactoId);
        impacto = String.valueOf(dbUtils.executeSQL(queryImpacto));
        String queryUrgencia = String.format("select t.tipo from TipoUrgenciaEntity t where t.id = '%s'", urgenciaId);
        urgencia = String.valueOf(dbUtils.executeSQL(queryUrgencia));
        log.info("frag 1");
        String queryPrioridad = String
                .format("select p from PrioridadIncidentesEntity p where p.urgencia = '%s' and p.impacto='%s'",
                        urgencia, impacto);
        log.info("{}:{}", urgencia, impacto);
        log.info("query Prioridad: {}", queryPrioridad);
        PrioridadIncidentesEntity prioridad = (PrioridadIncidentesEntity) dbUtils.executeSQL(queryPrioridad);
        log.info("frag 2: {}", dbUtils.executeSQL(queryPrioridad));

        AsignacionPrioridadModel asignacionPrioridad = new AsignacionPrioridadModel();
        asignacionPrioridad.setPrioridadDescription(prioridad.getPrioridad());
        asignacionPrioridad.setPrioridadIncidenteId(prioridad.getId());
        asignacionPrioridad.setUrgenciaId(urgenciaId);
        asignacionPrioridad.setUrgencia(urgencia);
        asignacionPrioridad.setImpactoId(impactoId);
        asignacionPrioridad.setImpacto(impacto);

        log.info("Response semi-final: {}", asignacionPrioridad);
        return asignacionPrioridad;
    }
}
