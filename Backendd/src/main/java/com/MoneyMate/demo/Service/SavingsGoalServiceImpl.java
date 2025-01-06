package com.MoneyMate.demo.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MoneyMate.demo.Model.SavingsGoal;
import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.SavingsGoalRepository;

@Service
public class SavingsGoalServiceImpl implements SavingsGoalService {
    
    private final SavingsGoalRepository savingsGoalRepository;
    private final UserService userService;

    @Autowired
    public SavingsGoalServiceImpl(SavingsGoalRepository savingsGoalRepository, UserService userService) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.userService = userService;
    }

    @Override
    public SavingsGoal createSavingsGoal(SavingsGoal goal, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        goal.setUser(user);
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setStatus("IN_PROGRESS");
        return savingsGoalRepository.save(goal);
    }

    @Override
    public SavingsGoal updateSavingsGoal(Long id, SavingsGoal goal, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        SavingsGoal existingGoal = savingsGoalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Savings goal not found"));

        if (!existingGoal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this savings goal");
        }

        existingGoal.setName(goal.getName());
        existingGoal.setTargetAmount(goal.getTargetAmount());
        existingGoal.setTargetDate(goal.getTargetDate());
        existingGoal.setDescription(goal.getDescription());

        return savingsGoalRepository.save(existingGoal);
    }

    @Override
    public void deleteSavingsGoal(Long id, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        SavingsGoal goal = savingsGoalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this savings goal");
        }

        savingsGoalRepository.deleteById(id);
    }

    @Override
    public List<SavingsGoal> getUserSavingsGoals(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        return savingsGoalRepository.findByUser(user);
    }

    @Override
    public List<SavingsGoal> getSavingsGoalsByStatus(String userEmail, String status) {
        User user = userService.findUserByEmail(userEmail);
        return savingsGoalRepository.findByUserAndStatus(user, status);
    }

    @Override
    public void updateProgress(Long id, BigDecimal amount, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        SavingsGoal goal = savingsGoalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Savings goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this savings goal");
        }

        BigDecimal newAmount = goal.getCurrentAmount().add(amount);
        goal.setCurrentAmount(newAmount);

        // Update status if goal is reached
        if (newAmount.compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        }

        savingsGoalRepository.save(goal);
    }
} 