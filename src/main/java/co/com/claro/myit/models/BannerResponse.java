/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

/**
 *
 * @author kompl
 */
public class BannerResponse {

    @SerializedName("isError")
    private boolean isError = false;
    
    @SerializedName("response")
    private List<BannerModel> response;

    public boolean isIsError() {
        return isError;
    }

    public void setIsError(boolean isError) {
        this.isError = isError;
    }

    public List<BannerModel> getResponse() {
        return response;
    }

    public void setResponse(List<BannerModel> response) {
        this.response = response;
    }
    

}
