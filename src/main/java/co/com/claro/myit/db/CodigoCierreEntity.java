package co.com.claro.myit.db;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "CODIGO_DE_CIERRE")
public class CodigoCierreEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID")
    private String id;
    @Column(name = "CODIGO_DE_CIERRE")
    private String codigo;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @Override
    public String toString() {
        return "CodigoCierreEntity{" +
                "id='" + id + '\'' +
                ", codigo='" + codigo + '\'' +
                '}';
    }
}
