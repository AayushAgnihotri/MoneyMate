package com.MoneyMate.demo.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.MoneyMate.demo.Model.Expense;

public interface ExpenseService {
    Expense addExpense(Expense expense, String userEmail);
    Expense updateExpense(Long id, Expense expense, String userEmail);
    void deleteExpense(Long id, String userEmail);
    List<Expense> getUserExpenses(String userEmail);
    List<Expense> getUserExpensesByType(String userEmail, String type);
    List<Expense> getUserExpensesByDateRange(String userEmail, LocalDateTime start, LocalDateTime end);
    Double getTotalByType(String userEmail, String type);
    Map<String, Double> getDashboardMetrics(String userEmail);
}
