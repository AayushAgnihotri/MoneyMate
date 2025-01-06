package com.MoneyMate.demo.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Model.Budget;
import com.MoneyMate.demo.Service.BudgetService;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BudgetController {
    
    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    private final BudgetService budgetService;

    @Autowired
    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<?> getUserBudgets(Authentication auth) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.badRequest().body("Authentication is required");
            }
            
            logger.info("Fetching budgets for user: {}", auth.getName());
            List<Budget> budgets = budgetService.getUserBudgets(auth.getName());
            logger.info("Found {} budgets", budgets.size());
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            logger.error("Error fetching budgets: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget, Authentication auth) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.badRequest().body("Authentication is required");
            }

            logger.info("Creating budget for user: {}, category: {}, amount: {}", 
                auth.getName(), budget.getCategory(), budget.getAmount());

            // Validate required fields
            if (budget.getCategory() == null || budget.getAmount() == null) {
                return ResponseEntity.badRequest().body("Category and amount are required");
            }

            // Set default values if not provided
            if (budget.getSpentAmount() == null) {
                budget.setSpentAmount(java.math.BigDecimal.ZERO);
            }
            if (budget.getStatus() == null) {
                budget.setStatus("ACTIVE");
            }
            budget.setCreatedAt(LocalDateTime.now());
            budget.setUpdatedAt(LocalDateTime.now());

            Budget newBudget = budgetService.createBudget(budget, auth.getName());
            logger.info("Successfully created budget with ID: {}", newBudget.getId());
            return ResponseEntity.ok(newBudget);
        } catch (Exception e) {
            logger.error("Error creating budget: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @RequestBody Budget budget, Authentication auth) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.badRequest().body("Authentication is required");
            }

            logger.info("Updating budget ID: {} for user: {}", id, auth.getName());
            Budget updatedBudget = budgetService.updateBudget(id, budget, auth.getName());
            logger.info("Successfully updated budget ID: {}", updatedBudget.getId());
            return ResponseEntity.ok(updatedBudget);
        } catch (Exception e) {
            logger.error("Error updating budget: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable Long id, Authentication auth) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.badRequest().body("Authentication is required");
            }

            logger.info("Fetching budget with ID: {} for user: {}", id, auth.getName());
            Budget budget = budgetService.findById(id);
            
            // Verify the budget belongs to the authenticated user
            if (!budget.getUser().getEmail().equals(auth.getName())) {
                logger.error("User {} not authorized to access budget {}", auth.getName(), id);
                return ResponseEntity.status(403).body("Not authorized to access this budget");
            }

            logger.info("Successfully retrieved budget with ID: {}", id);
            return ResponseEntity.ok(budget);
        } catch (Exception e) {
            logger.error("Error fetching budget by ID: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id, Authentication auth) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.badRequest().body("Authentication is required");
            }

            logger.info("Deleting budget ID: {} for user: {}", id, auth.getName());
            budgetService.deleteBudget(id, auth.getName());
            logger.info("Successfully deleted budget ID: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting budget: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getBudgetByCategory(@PathVariable String category, Authentication auth) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.badRequest().body("Authentication is required");
            }

            logger.info("Fetching budget for category: {} and user: {}", category, auth.getName());
            Budget budget = budgetService.getBudgetByCategory(auth.getName(), category);
            if (budget != null) {
                logger.info("Found budget with ID: {}", budget.getId());
                return ResponseEntity.ok(budget);
            } else {
                logger.info("No budget found for category: {}", category);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching budget by category: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
