/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.sql.Blob;


/**
 *
 * @author JD
 */
@Entity
@Table(name = "LANADM.DOCUMENTOS_CASO")
public class DocumentosEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name="ID")
    private int id;
    
    @Column(name="ID_CASO")
    private int idCaso;
        
    @Column(name="DOCUMENTO")
    private Blob documento;
    
    @Column(name="NOMBRE")
    private String nombre;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdCaso() {
        return idCaso;
    }

    public void setIdCaso(int idCaso) {
        this.idCaso = idCaso;
    }

    public Blob getDocumento() {
        return documento;
    }

    public void setDocumento(Blob documento) {
        this.documento = documento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    
    
}
