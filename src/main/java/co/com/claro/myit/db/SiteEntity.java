/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author JD
 */
@Entity
@Table(name = "ARADMIN.T432")
@XmlRootElement
@NamedQuery(name = "Sedes.listUniques", 
            query = "SELECT DISTINCT a.sede as sede FROM SiteEntity a ORDER BY a.sede ASC")
public class SiteEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    
    
    @Id
    @Column(name = "C1")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

   
    @Column(name = "C260000001")
    private String sede;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSede() {
        return sede;
    }

    public void setSede(String sede) {
        this.sede = sede;
    }
    
    @Override
    public String toString() {
        return "co.com.claro.myit.db.SiteEntity[ id=" + id + " ]";
    }
    
}
