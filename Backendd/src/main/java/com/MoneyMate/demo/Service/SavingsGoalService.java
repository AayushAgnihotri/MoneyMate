package com.MoneyMate.demo.Service;

import java.math.BigDecimal;
import java.util.List;

import com.MoneyMate.demo.Model.SavingsGoal;

public interface SavingsGoalService {
    SavingsGoal createSavingsGoal(SavingsGoal goal, String userEmail);
    SavingsGoal updateSavingsGoal(Long id, SavingsGoal goal, String userEmail);
    void deleteSavingsGoal(Long id, String userEmail);
    List<SavingsGoal> getUserSavingsGoals(String userEmail);
    List<SavingsGoal> getSavingsGoalsByStatus(String userEmail, String status);
    void updateProgress(Long id, BigDecimal amount, String userEmail);
}
