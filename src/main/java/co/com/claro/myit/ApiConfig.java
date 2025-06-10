/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit;

import co.com.claro.myit.api.*;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import java.util.Set;


/**
 *
 * @author Desarrollo
 */

@ApplicationPath("api")
public class ApiConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        resources.add(Login.class);
        resources.add(Banner.class);
        resources.add(Avatar.class);
        resources.add(Survey.class);
        resources.add(Logout.class);
        resources.add(DecUtil.class);
        resources.add(People.class);
        resources.add(GenericList.class);
        resources.add(Contingencia.class);
        resources.add(CasesList.class);
        resources.add(CasesCrud.class);
        resources.add(Casos.class);
        resources.add(ConsultaINC.class);
        resources.add(ConsultaWO.class);
        resources.add(ConsultaNotasINC.class);
        resources.add(ConsultaNotasWO.class);
        resources.add(CrearNotasInc.class);
        resources.add(CrearNotasWo.class);
        resources.add(ContingenciaChatBot.class);
        resources.add(ConsultaHistoricoRequerimientos.class);
        resources.add(Inactividad.class);
        return resources;
    }

}
