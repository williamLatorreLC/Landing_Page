/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaRequerimientoRequest;
import co.com.claro.myit.util.functions;


/**
 *
 * @author dussan.palma
 */
public class ConsultaCasosService {

    private final ConsultaRequerimientoRequest data;

    private functions fn;

    public ConsultaCasosService(ConsultaRequerimientoRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String consultarReq() {
        String body = "";

        body = Const.xmlRequestConsultaReq;
        body = body.replaceAll("--req--", this.data.getReqNumber());
        System.out.println(body);

        return this.fn.SoapRequestConsutaReq(body, false);

    }
}
