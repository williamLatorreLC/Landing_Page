package co.com.claro.myit.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@Entity
@Table(name = "DETALLE_IMPACTO")
@XmlRootElement
public class TipoImpactoEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID_IMPACTO")
    private String id;
    @Column(name = "IMPACTO")
    private String tipo;
    @Column(name = "DETALLE_IMPACTO")
    private String detalle;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    @Override
    public String toString() {
        return "TipoImpactoEntity{" +
                "id='" + id + '\'' +
                ", tipo='" + tipo + '\'' +
                ", detalle='" + detalle + '\'' +
                '}';
    }
}
