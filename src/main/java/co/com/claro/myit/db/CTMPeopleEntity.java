/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author JD
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "ARADMIN.T1459")
@XmlRootElement
public class CTMPeopleEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "C1")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String personID;

    @Column(name = "C4")
    private String remedyID;


    @Column(name = "C7")
    private int profileStatus;

    @Column(name = "C8")
    private String description;


    @Column(name = "C112")
    private String groups;

    @Column(name = "C1000000019")
    private String firstName;

    @Column(name = "C1000000018")
    private String lastName;

    @Column(name = "C1000000026")
    private Integer vip;

}
