package co.com.claro.myit.db;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@Entity
@Table(name = "DETALLE_URGENCIA")
@XmlRootElement
public class TipoUrgenciaEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID_URGENCIA")
    private String id;
    @Column(name = "`DETALLE URGENCIA`")
    private String detalle;
    @Column(name = "URGENCIA")
    private String tipo;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    @Override
    public String toString() {
        return "TipoUrgenciaEntity{" +
                "id='" + id + '\'' +
                ", detalle='" + detalle + '\'' +
                ", tipo='" + tipo + '\'' +
                '}';
    }
}
