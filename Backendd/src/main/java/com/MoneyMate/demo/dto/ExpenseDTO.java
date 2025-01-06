package com.MoneyMate.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ExpenseDTO {
    private Long id;
    
    @NotNull(message = "Description is required")
    private String description;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Category is required")
    private String category;
    
    @NotNull(message = "Payment method is required")
    private String paymentMethod;
    
    @NotNull(message = "Date is required")
    private LocalDateTime date;
    
    @NotNull(message = "Type is required")
    private String type;
    
    private String status;
    private String notes;
} 