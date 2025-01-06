package com.MoneyMate.demo.Security;

public class AuthResponse {

    private String token;

    // Constructor to initialize the token
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getter method for the token
    public String getToken() {
        return token;
    }

    // Setter method for the token
    public void setToken(String token) {
        this.token = token;
    }
}
