package com.MoneyMate.demo.Service;

import java.util.List;

import com.MoneyMate.demo.Model.Budget;
import com.MoneyMate.demo.Model.Transaction;

public interface BudgetService {
    Budget createBudget(Budget budget, String userEmail);
    Budget updateBudget(Long id, Budget budget, String userEmail);
    void deleteBudget(Long id, String userEmail);
    List<Budget> getUserBudgets(String userEmail);
    Budget getBudgetByCategory(String userEmail, String category);
    void updateBudgetSpending(String userEmail, String category, Double amount);
    void updateBudgetForTransaction(Transaction transaction, String operation);
    Budget findById(Long id);
}

