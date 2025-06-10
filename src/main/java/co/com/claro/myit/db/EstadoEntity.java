package co.com.claro.myit.db;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
