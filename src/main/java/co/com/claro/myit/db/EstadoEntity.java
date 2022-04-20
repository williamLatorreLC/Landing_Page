package co.com.claro.myit.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "ESTADO")
public class EstadoEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    private String id;
    private String estado;

    @Id
    @Column(name = "ID")
    public String getId() {
        return id;
    }

    @Column(name = "ESTADO")
    public void setId(String id) {
        this.id = id;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "EstadoEntity{" +
                "id='" + id + '\'' +
                ", estado='" + estado + '\'' +
                '}';
    }
}
