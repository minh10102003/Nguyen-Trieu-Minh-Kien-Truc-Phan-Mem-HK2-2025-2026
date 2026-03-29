package com.food.order.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_detail")
public class UserDetail {

    @Id
    private Long id;

    @Column(nullable = false)
    private String address;

    public UserDetail() {
    }

    public UserDetail(Long id, String address) {
        this.id = id;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

