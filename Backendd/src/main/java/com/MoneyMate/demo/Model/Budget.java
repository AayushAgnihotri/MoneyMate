package com.MoneyMate.demo.Model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "budget")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "spent_amount", precision = 38, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 20)
    private String period;

    @Column(name = "alert_threshold")
    private Integer alertThreshold;

    @Column(length = 20)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(length = 255)
    private String description;

    @PrePersist
    public void prePersist() {
        if (spentAmount == null) {
            spentAmount = BigDecimal.ZERO;
        }
        if (amount == null) {
            amount = BigDecimal.ZERO;
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods for spent amount manipulation
    public void addToSpent(BigDecimal amount) {
        if (this.spentAmount == null) {
            this.spentAmount = BigDecimal.ZERO;
        }
        this.spentAmount = this.spentAmount.add(amount);
    }

    public void subtractFromSpent(BigDecimal amount) {
        if (this.spentAmount == null) {
            this.spentAmount = BigDecimal.ZERO;
        }
        this.spentAmount = this.spentAmount.subtract(amount);
        if (this.spentAmount.compareTo(BigDecimal.ZERO) < 0) {
            this.spentAmount = BigDecimal.ZERO;
        }
    }
}
