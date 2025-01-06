package com.MoneyMate.demo.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.MoneyMate.demo.Model.Expense;
import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.ExpenseRepository;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    
    private static final Logger logger = LoggerFactory.getLogger(ExpenseServiceImpl.class);
    
    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository, UserService userService) {
        this.expenseRepository = expenseRepository;
        this.userService = userService;
    }

    @Override
    @Transactional
    public Expense addExpense(Expense expense, String userEmail) {
        try {
            logger.debug("Adding expense for user: {}", userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }
            expense.setUser(user);
            Expense savedExpense = expenseRepository.save(expense);
            logger.debug("Successfully added expense with ID: {}", savedExpense.getId());
            return savedExpense;
        } catch (Exception e) {
            logger.error("Error adding expense for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to add expense: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getUserExpenses(String userEmail) {
        try {
            logger.debug("Fetching expenses for user: {}", userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }
            List<Expense> expenses = expenseRepository.findByUser(user);
            logger.debug("Found {} expenses for user {}", expenses.size(), userEmail);
            return expenses;
        } catch (Exception e) {
            logger.error("Error fetching expenses for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to fetch expenses: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getUserExpensesByType(String userEmail, String type) {
        try {
            logger.debug("Fetching expenses by type {} for user: {}", type, userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }
            return expenseRepository.findByUserAndType(user, type);
        } catch (Exception e) {
            logger.error("Error fetching expenses by type for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to fetch expenses by type: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getUserExpensesByDateRange(String userEmail, LocalDateTime start, LocalDateTime end) {
        try {
            logger.debug("Fetching expenses between {} and {} for user: {}", start, end, userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }
            return expenseRepository.findByUserAndDateBetween(user, start, end);
        } catch (Exception e) {
            logger.error("Error fetching expenses by date range for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to fetch expenses by date range: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Double getTotalByType(String userEmail, String type) {
        try {
            logger.debug("Calculating total for type {} for user: {}", type, userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }
            return expenseRepository.getTotalByUserAndType(user, type);
        } catch (Exception e) {
            logger.error("Error calculating total by type for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to calculate total: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteExpense(Long id, String userEmail) {
        try {
            logger.debug("Deleting expense {} for user: {}", id, userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }

            Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

            if (!expense.getUser().getId().equals(user.getId())) {
                logger.error("Unauthorized deletion attempt of expense {} by user {}", id, userEmail);
                throw new RuntimeException("Unauthorized to delete this expense");
            }

            expenseRepository.deleteById(id);
            logger.debug("Successfully deleted expense {}", id);
        } catch (Exception e) {
            logger.error("Error deleting expense {} for user {}: {}", id, userEmail, e.getMessage());
            throw new RuntimeException("Failed to delete expense: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Expense updateExpense(Long id, Expense expense, String userEmail) {
        try {
            logger.debug("Updating expense {} for user: {}", id, userEmail);
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                throw new RuntimeException("User not found");
            }

            Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

            if (!existingExpense.getUser().getId().equals(user.getId())) {
                logger.error("Unauthorized update attempt of expense {} by user {}", id, userEmail);
                throw new RuntimeException("Unauthorized to update this expense");
            }

            existingExpense.setAmount(expense.getAmount());
            existingExpense.setCategory(expense.getCategory());
            existingExpense.setDescription(expense.getDescription());
            existingExpense.setDate(expense.getDate());
            existingExpense.setType(expense.getType());
            existingExpense.setPaymentMethod(expense.getPaymentMethod());
            existingExpense.setNotes(expense.getNotes());

            Expense updatedExpense = expenseRepository.save(existingExpense);
            logger.debug("Successfully updated expense {}", id);
            return updatedExpense;
        } catch (Exception e) {
            logger.error("Error updating expense {} for user {}: {}", id, userEmail, e.getMessage());
            throw new RuntimeException("Failed to update expense: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Double> getDashboardMetrics(String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            List<Expense> expenses = expenseRepository.findByUser(user);
            
            double totalIncome = expenses.stream()
                .filter(e -> "INCOME".equals(e.getType()))
                .mapToDouble(e -> e.getAmount().doubleValue())
                .sum();

            double totalExpenses = expenses.stream()
                .filter(e -> "EXPENSE".equals(e.getType()))
                .mapToDouble(e -> e.getAmount().doubleValue())
                .sum();

            double totalBalance = totalIncome - totalExpenses;

            Map<String, Double> metrics = new HashMap<>();
            metrics.put("totalBalance", totalBalance);
            metrics.put("totalIncome", totalIncome);
            metrics.put("totalExpenses", totalExpenses);

            return metrics;
        } catch (Exception e) {
            logger.error("Error calculating dashboard metrics for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to calculate dashboard metrics");
        }
    }
} 