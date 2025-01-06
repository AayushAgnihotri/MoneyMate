package com.MoneyMate.demo.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"expenses", "email", "password", "enabled", "accountNonLocked", 
        "authorities", "username", "accountNonExpired", "credentialsNonExpired"})
    private User user;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String category;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String type; // EXPENSE or INCOME

    private String status = "COMPLETED";
    private String notes;

    // Default Constructor
    public Expense() {
    }

    // Constructor with all fields (excluding ID, as it's auto-generated)
    public Expense(BigDecimal amount, String category, String description, LocalDateTime date, User user) {
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.date = date;
        this.user = user;
    }

    // toString Method for Debugging
    @Override
    public String toString() {
        return "Expense{" +
                "id=" + id +
                ", amount=" + amount +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", date=" + date +
                ", user=" + (user != null ? user.getId() : "null") + // Avoid full user details
                '}';
    }
}
