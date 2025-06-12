package co.com.claro.myit.db;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;


@Entity
@Table(name = "TIPO_CLIENTE")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "TipoCliente.findAll",
                query = "SELECT c FROM TipoClienteEntity c WHERE c.estado = :estado")
})
public class TipoClienteEntity implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    @Column(name = "ID_TIPO_CLIENTE")
    private String id;

    @Column(name = "TIPO_CLIENTE")
    private String tipo;

    @Column(name = "ESTADO")
    private Integer estado;

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

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "TipoClienteEntity{" +
                "id='" + id + '\'' +
                ", tipo='" + tipo + '\'' +
                ", estado=" + estado +
                '}';
    }
}
