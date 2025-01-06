package com.MoneyMate.demo.Controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Model.Goal;
import com.MoneyMate.demo.Service.GoalService;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    
    private static final Logger logger = LoggerFactory.getLogger(GoalController.class);
    
    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<?> getUserGoals(Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
            }
            List<Goal> goals = goalService.getUserGoals(auth.getName());
            return ResponseEntity.ok(goals);
        } catch (Exception e) {
            logger.error("Error fetching goals: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch goals: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal, Authentication auth) {
        Goal newGoal = goalService.createGoal(goal, auth.getName());
        return ResponseEntity.ok(newGoal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(
            @PathVariable Long id,
            @RequestBody Goal goal,
            Authentication auth) {
        Goal updatedGoal = goalService.updateGoal(id, goal, auth.getName());
        return ResponseEntity.ok(updatedGoal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id, Authentication auth) {
        goalService.deleteGoal(id, auth.getName());
        return ResponseEntity.ok().build();
    }
} 