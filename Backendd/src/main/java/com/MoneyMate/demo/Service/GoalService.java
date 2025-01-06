package com.MoneyMate.demo.Service;

import java.util.List;

import com.MoneyMate.demo.Model.Goal;

public interface GoalService {
    Goal createGoal(Goal goal, String userEmail);
    Goal updateGoal(Long id, Goal goal, String userEmail);
    void deleteGoal(Long id, String userEmail);
    List<Goal> getUserGoals(String userEmail);
    Goal getGoalById(Long id, String userEmail);
} 