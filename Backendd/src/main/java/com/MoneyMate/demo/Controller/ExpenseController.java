package com.MoneyMate.demo.Controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Model.Expense;
import com.MoneyMate.demo.Service.ExpenseService;
import com.MoneyMate.demo.dto.ApiResponse;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    
    private final ExpenseService expenseService;
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getUserExpenses(Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                logger.error("Authentication is null or invalid");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            logger.info("Fetching expenses for user: {}", auth.getName());
            List<Expense> expenses = expenseService.getUserExpenses(auth.getName());
            
            if (expenses == null) {
                logger.warn("No expenses found for user: {}", auth.getName());
                return ResponseEntity.ok(Collections.emptyList());
            }
            
            logger.info("Successfully fetched {} expenses", expenses.size());
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            logger.error("Error fetching expenses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByType(
            @PathVariable String type, 
            Authentication auth) {
        try {
            List<Expense> expenses = expenseService.getUserExpensesByType(auth.getName(), type);
            return ResponseEntity.ok(ApiResponse.success(expenses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            Authentication auth) {
        try {
            List<Expense> expenses = expenseService.getUserExpensesByDateRange(auth.getName(), start, end);
            return ResponseEntity.ok(ApiResponse.success(expenses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/total/{type}")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getTotalByType(
            @PathVariable String type, 
            Authentication auth) {
        try {
            Double total = expenseService.getTotalByType(auth.getName(), type);
            return ResponseEntity.ok(ApiResponse.success(Map.of("total", total != null ? total : 0.0)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(
            @RequestBody Expense expense, 
            Authentication auth) {
        try {
            Expense newExpense = expenseService.addExpense(expense, auth.getName());
            return ResponseEntity.ok(ApiResponse.success(newExpense));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense,
            Authentication auth) {
        try {
            Expense updatedExpense = expenseService.updateExpense(id, expense, auth.getName());
            return ResponseEntity.ok(ApiResponse.success(updatedExpense));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id, 
            Authentication auth) {
        try {
            expenseService.deleteExpense(id, auth.getName());
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Double>> getDashboardMetrics(Authentication auth) {
        try {
            Map<String, Double> metrics = expenseService.getDashboardMetrics(auth.getName());
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("Error fetching dashboard metrics: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
