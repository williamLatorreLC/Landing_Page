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
 * @author Dussan.palma
 */
@Entity
@Table(name = "contingenciaChatBot")
@XmlRootElement
public class ContingenciaChatBotEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    @Column(name = "tipo")
    private String tipo;
    
    @Column(name = "estado")
    private int estado;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    
    
    

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 47 * hash + this.id;
        return hash;
    }

  
    @Override
    public String toString() {
        return "co.com.claro.myit.db.ContingenciaChatBotEntity[ id=" + id + " ]";
    }
    
}
