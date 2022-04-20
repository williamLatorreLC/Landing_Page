/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author kompl
 */


@Entity
@Table(name = "avatars")
@XmlRootElement
public class AvatarEntity {

    public AvatarEntity() {
    }
    
     public AvatarEntity(int id, String imagen,int estado) {
        this.id = id;
        this.imagen = imagen;
        this.estado=estado;
    }
    
    public AvatarEntity(String imagen) {
        this.imagen = imagen;
    }
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    @Column(name = "imagen")
    private String imagen;

    @Column(name = "estado")
    private int estado=1;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }
    
    
    
}
