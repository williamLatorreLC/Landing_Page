package co.com.claro.myit.db;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "banners")
@XmlRootElement
public class BannerEntity implements Serializable {
    
    public BannerEntity(){
        
    }

    public BannerEntity(int id, String ruta,int estado) {
        this.id = id;
        this.ruta = ruta;
        this.estado=estado;
    }
    
    public BannerEntity(String ruta) {
        this.ruta = ruta;
    }
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    @Column(name = "ruta")
    private String ruta;

    @Column(name = "estado")
    private int estado=1;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    
}
