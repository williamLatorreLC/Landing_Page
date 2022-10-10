/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import com.google.gson.annotations.SerializedName;
import com.sun.istack.Nullable;

/**
 *
 * @author kompl
 */
public class LoginRequest {
    @SerializedName("user")
    private String user;
    
    @SerializedName("pass")
    private String pass;
    
    @Nullable
    @SerializedName("closeSessions")
    private boolean closeSessions=false;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public boolean isCloseSessions() {
        return closeSessions;
    }

    public void setCloseSessions(boolean closeSessions) {
        this.closeSessions = closeSessions;
    }
    
}
