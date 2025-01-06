package com.MoneyMate.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.MoneyMate.demo.Model.Budget;
import com.MoneyMate.demo.Model.Transaction;
import com.MoneyMate.demo.Repository.TransactionRepository;

@Service
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final BudgetService budgetService;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.budgetService = budgetService;
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        System.out.println("Creating transaction for category: " + transaction.getCategory() + 
                         " amount: " + transaction.getAmount());
        
        if (transaction.getAmount() == null || transaction.getCategory() == null || 
            transaction.getUser() == null || transaction.getUser().getEmail() == null) {
            throw new IllegalArgumentException("Transaction must have amount, category, and user");
        }

        // First save the transaction
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Then update the corresponding budget
        try {
            System.out.println("Attempting to update budget for user: " + transaction.getUser().getEmail() +
                             ", category: " + transaction.getCategory());
            
            Budget budget = budgetService.getBudgetByCategory(
                transaction.getUser().getEmail(),
                transaction.getCategory()
            );
            
            if (budget != null) {
                System.out.println("Found budget with current spent: " + budget.getSpentAmount());
                budgetService.updateBudgetForTransaction(savedTransaction, "ADD");
                
                // Verify the update
                Budget updatedBudget = budgetService.getBudgetByCategory(
                    transaction.getUser().getEmail(),
                    transaction.getCategory()
                );
                System.out.println("Budget after update - spent amount: " + updatedBudget.getSpentAmount());
            } else {
                System.out.println("No budget found for category: " + transaction.getCategory());
            }
        } catch (Exception e) {
            System.err.println("Error updating budget: " + e.getMessage());
            e.printStackTrace();
        }
        
        return savedTransaction;
    }

    @Transactional
    public void deleteTransaction(Transaction transaction) {
        if (transaction.getAmount() == null || transaction.getCategory() == null || 
            transaction.getUser() == null || transaction.getUser().getEmail() == null) {
            throw new IllegalArgumentException("Transaction must have amount, category, and user");
        }

        try {
            Budget budget = budgetService.getBudgetByCategory(
                transaction.getUser().getEmail(),
                transaction.getCategory()
            );
            
            if (budget != null) {
                System.out.println("Found budget with current spent: " + budget.getSpentAmount());
                budgetService.updateBudgetForTransaction(transaction, "DELETE");
                
                // Verify the update
                Budget updatedBudget = budgetService.getBudgetByCategory(
                    transaction.getUser().getEmail(),
                    transaction.getCategory()
                );
                System.out.println("Budget after delete - spent amount: " + updatedBudget.getSpentAmount());
            }
        } catch (Exception e) {
            System.err.println("Error updating budget: " + e.getMessage());
            e.printStackTrace();
        }
        
        transactionRepository.delete(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Transaction oldTransaction, Transaction newTransaction) {
        try {
            // First, reverse the old transaction's effect on the budget
            Budget oldBudget = budgetService.getBudgetByCategory(
                oldTransaction.getUser().getEmail(),
                oldTransaction.getCategory()
            );
            
            if (oldBudget != null) {
                budgetService.updateBudgetForTransaction(oldTransaction, "DELETE");
            }
            
            // Save the new transaction
            Transaction savedTransaction = transactionRepository.save(newTransaction);
            
            // Then update the budget with the new transaction
            Budget newBudget = budgetService.getBudgetByCategory(
                newTransaction.getUser().getEmail(),
                newTransaction.getCategory()
            );
            
            if (newBudget != null) {
                budgetService.updateBudgetForTransaction(savedTransaction, "ADD");
            }
            
            return savedTransaction;
        } catch (Exception e) {
            System.err.println("Error updating budget: " + e.getMessage());
            return transactionRepository.save(newTransaction);
        }
    }
} 