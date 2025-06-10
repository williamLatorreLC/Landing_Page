/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;


/**
 *
 * @author JD
 */
@Entity
@Table(name = "ARADMIN.T1275")
@XmlRootElement
public class SupportGroupMembersEntity implements Serializable {

    @Id
    @Column(name = "C1")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    
    @Column(name = "C1000000079")
    private String idGrupo;

    @Column(name = "C4")
    private String usuario;

    @Column(name = "C1000000017")
    private String nombre;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getIdGrupo() {
        return idGrupo;
    }

    public void setIdGrupo(String idGrupo) {
        this.idGrupo = idGrupo;
    }
    
    
}
