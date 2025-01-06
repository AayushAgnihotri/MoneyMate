package com.MoneyMate.demo.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.MoneyMate.demo.Model.Budget;
import com.MoneyMate.demo.Model.Transaction;
import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.BudgetRepository;

@Service
public class BudgetServiceImpl implements BudgetService {
    
    private final BudgetRepository budgetRepository;
    private final UserService userService;

    @Autowired
    public BudgetServiceImpl(BudgetRepository budgetRepository, UserService userService) {
        this.budgetRepository = budgetRepository;
        this.userService = userService;
    }

    @Override
    @Transactional
    public Budget createBudget(Budget budget, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        budget.setUser(user);
        
        // Set default values if not provided
        if (budget.getSpentAmount() == null) {
            budget.setSpentAmount(BigDecimal.ZERO);
        }
        if (budget.getAmount() == null) {
            budget.setAmount(BigDecimal.ZERO);
        }
        if (budget.getStatus() == null) {
            budget.setStatus("ACTIVE");
        }
        
        budget.setCreatedAt(LocalDateTime.now());
        budget.setUpdatedAt(LocalDateTime.now());
        
        return budgetRepository.save(budget);
    }

    @Override
    @Transactional
    public Budget updateBudget(Long id, Budget budget, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        Budget existingBudget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!existingBudget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this budget");
        }

        existingBudget.setCategory(budget.getCategory());
        existingBudget.setAmount(budget.getAmount());
        existingBudget.setDescription(budget.getDescription());
        existingBudget.setStartDate(budget.getStartDate());
        existingBudget.setEndDate(budget.getEndDate());
        existingBudget.setPeriod(budget.getPeriod());
        existingBudget.setAlertThreshold(budget.getAlertThreshold());
        existingBudget.setStatus(budget.getStatus());
        existingBudget.setUpdatedAt(LocalDateTime.now());

        return budgetRepository.save(existingBudget);
    }

    @Override
    @Transactional
    public void deleteBudget(Long id, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this budget");
        }

        budgetRepository.deleteById(id);
    }

    @Override
    public List<Budget> getUserBudgets(String userEmail) {
        System.out.println("Fetching budgets for user: " + userEmail);
        User user = userService.findUserByEmail(userEmail);
        List<Budget> budgets = budgetRepository.findByUser(user);
        System.out.println("Found " + budgets.size() + " budgets");
        budgets.forEach(budget -> {
            System.out.println("Budget: " + budget.getCategory() + 
                             ", Amount: " + budget.getAmount() + 
                             ", Spent: " + budget.getSpentAmount());
        });
        return budgets;
    }

    @Override
    public Budget getBudgetByCategory(String userEmail, String category) {
        System.out.println("Fetching budget for user: " + userEmail + ", category: " + category);
        User user = userService.findUserByEmail(userEmail);
        Budget budget = budgetRepository.findByUser_IdAndCategory(user.getId(), category);
        if (budget != null) {
            System.out.println("Found budget - Category: " + budget.getCategory() + 
                             ", Amount: " + budget.getAmount() + 
                             ", Spent: " + budget.getSpentAmount());
        } else {
            System.out.println("No budget found for category: " + category);
        }
        return budget;
    }

    @Override
    @Transactional
    public void updateBudgetSpending(String userEmail, String category, Double amount) {
        Budget budget = getBudgetByCategory(userEmail, category);
        if (budget != null) {
            BigDecimal currentSpent = budget.getSpentAmount();
            budget.setSpentAmount(currentSpent.add(BigDecimal.valueOf(amount)));
            budget.setUpdatedAt(LocalDateTime.now());
            budgetRepository.save(budget);
        }
    }

    @Override
    @Transactional
    public void updateBudgetForTransaction(Transaction transaction, String operation) {
        System.out.println("Updating budget for transaction - Category: " + transaction.getCategory() + 
                         " Amount: " + transaction.getAmount() + " Operation: " + operation);
        
        Budget budget = budgetRepository.findByUser_IdAndCategory(
            transaction.getUser().getId(), 
            transaction.getCategory()
        );

        if (budget != null && transaction.getAmount() != null) {
            System.out.println("Current budget spent amount: " + budget.getSpentAmount());
            BigDecimal oldSpent = budget.getSpentAmount();
            
            if ("ADD".equals(operation)) {
                budget.addToSpent(transaction.getAmount());
                System.out.println("Added amount to budget, new spent: " + budget.getSpentAmount());
            } else if ("DELETE".equals(operation)) {
                budget.subtractFromSpent(transaction.getAmount());
                System.out.println("Subtracted amount from budget, new spent: " + budget.getSpentAmount());
            }
            
            budget.setUpdatedAt(LocalDateTime.now());
            
            try {
                Budget savedBudget = budgetRepository.saveAndFlush(budget);
                System.out.println("Saved budget - Old spent: " + oldSpent + 
                                 ", New spent: " + savedBudget.getSpentAmount());
                
                // Verify the save was successful by reloading the budget
                Budget reloadedBudget = budgetRepository.findById(budget.getId()).orElse(null);
                if (reloadedBudget != null) {
                    System.out.println("Reloaded budget spent amount: " + reloadedBudget.getSpentAmount());
                }
            } catch (Exception e) {
                System.err.println("Error saving budget: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Budget not found or transaction amount is null");
            if (budget == null) System.out.println("Budget is null");
            if (transaction.getAmount() == null) System.out.println("Transaction amount is null");
        }
    }

    @Override
    public Budget findById(Long id) {
        return budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
    }
} 