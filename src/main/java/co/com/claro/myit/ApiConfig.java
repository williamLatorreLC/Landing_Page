/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit;

import co.com.claro.myit.api.*;
import java.util.Set;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

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
        return resources;
    }

}
