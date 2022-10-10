
package co.com.claro.myit.db;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author jcabarcas
 */
@Entity
@Table(name = "userSession")
@XmlRootElement
public class UserSessionEntity implements Serializable {
    
    public UserSessionEntity(){
        
    }

    public UserSessionEntity(String userID,String sessionTime) {
        this.userID = userID;
        this.sessionTime=sessionTime;
        this.active=true;
    }
    
    public UserSessionEntity(String userID) {
        this.userID = userID;
    }
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    @Column(name = "userID")
    private String userID;
    
    
    @Column(name = "sessionTime")
    private String sessionTime;
    
    
    @Column(name = "active")
    private boolean active=true;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getSessionTime() {
        return sessionTime;
    }

    public void setSessionTime(String sessionTime) {
        this.sessionTime = sessionTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
    
}
