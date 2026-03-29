package com.food.order.model;

/**
 * DTO used for partition demo (horizontal/vertical).
 * Keep it simple: name, gender, address.
 */
public class User {

    private String name;
    private String gender;
    private String address;

    public User() {
    }

    public User(String name, String gender, String address) {
        this.name = name;
        this.gender = gender;
        this.address = address;
    }

    public User(String name, String gender) {
        this(name, gender, null);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

