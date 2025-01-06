package com.MoneyMate.demo.Service;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.MoneyMate.demo.Model.Goal;
import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.GoalRepository;

@Service
public class GoalServiceImpl implements GoalService {
    
    private static final Logger logger = LoggerFactory.getLogger(GoalServiceImpl.class);
    
    private final GoalRepository goalRepository;
    private final UserService userService;
    
    @Autowired
    public GoalServiceImpl(GoalRepository goalRepository, UserService userService) {
        this.goalRepository = goalRepository;
        this.userService = userService;
    }

    @Override
    @Transactional
    public Goal createGoal(Goal goal, String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            goal.setUser(user);
            goal.setCreatedAt(LocalDate.now());
            
            Goal savedGoal = goalRepository.save(goal);
            logger.info("Created new goal for user: {}", userEmail);
            return savedGoal;
        } catch (Exception e) {
            logger.error("Error creating goal for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to create goal: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Goal updateGoal(Long id, Goal goal, String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            Goal existingGoal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

            if (!existingGoal.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to update this goal");
            }

            existingGoal.setName(goal.getName());
            existingGoal.setTargetAmount(goal.getTargetAmount());
            existingGoal.setCurrentAmount(goal.getCurrentAmount());
            existingGoal.setDeadline(goal.getDeadline());
            existingGoal.setMonthlySaving(goal.getMonthlySaving());
            existingGoal.setCategory(goal.getCategory());
            existingGoal.setPriority(goal.getPriority());

            Goal updatedGoal = goalRepository.save(existingGoal);
            logger.info("Updated goal {} for user: {}", id, userEmail);
            return updatedGoal;
        } catch (Exception e) {
            logger.error("Error updating goal {} for user {}: {}", id, userEmail, e.getMessage());
            throw new RuntimeException("Failed to update goal: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteGoal(Long id, String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

            if (!goal.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to delete this goal");
            }

            goalRepository.deleteById(id);
            logger.info("Deleted goal {} for user: {}", id, userEmail);
        } catch (Exception e) {
            logger.error("Error deleting goal {} for user {}: {}", id, userEmail, e.getMessage());
            throw new RuntimeException("Failed to delete goal: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Goal> getUserGoals(String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            List<Goal> goals = goalRepository.findByUserOrderByDeadlineAsc(user);
            logger.info("Retrieved {} goals for user: {}", goals.size(), userEmail);
            return goals;
        } catch (Exception e) {
            logger.error("Error retrieving goals for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Failed to retrieve goals: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Goal getGoalById(Long id, String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

            if (!goal.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to access this goal");
            }

            return goal;
        } catch (Exception e) {
            logger.error("Error retrieving goal {} for user {}: {}", id, userEmail, e.getMessage());
            throw new RuntimeException("Failed to retrieve goal: " + e.getMessage());
        }
    }
} 