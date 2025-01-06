package com.MoneyMate.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetDTO {
    private Long id;
    
    @NotNull(message = "Category is required")
    private String category;
    
    @NotNull(message = "Budget limit is required")
    @Positive(message = "Budget limit must be positive")
    private BigDecimal limit;
    
    private BigDecimal spent;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;
    
    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
    
    private String status;
    
    @NotNull(message = "Period is required")
    private String period;
    
    // Additional fields for frontend display
    private BigDecimal remainingAmount;
    private double spentPercentage;
    private String alertType; // "NORMAL", "WARNING", "DANGER"
} 