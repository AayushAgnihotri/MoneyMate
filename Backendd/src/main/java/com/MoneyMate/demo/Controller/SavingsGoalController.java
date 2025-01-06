package com.MoneyMate.demo.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Model.SavingsGoal;
import com.MoneyMate.demo.Service.SavingsGoalService;

@RestController
@RequestMapping("/api/savings")
public class SavingsGoalController {
    
    private final SavingsGoalService savingsGoalService;

    @Autowired
    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @PostMapping
    public ResponseEntity<SavingsGoal> createSavingsGoal(@RequestBody SavingsGoal goal, Authentication auth) {
        SavingsGoal newGoal = savingsGoalService.createSavingsGoal(goal, auth.getName());
        return ResponseEntity.ok(newGoal);
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getUserSavingsGoals(Authentication auth) {
        List<SavingsGoal> goals = savingsGoalService.getUserSavingsGoals(auth.getName());
        return ResponseEntity.ok(goals);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoal> updateSavingsGoal(
            @PathVariable Long id, 
            @RequestBody SavingsGoal goal, 
            Authentication auth) {
        SavingsGoal updatedGoal = savingsGoalService.updateSavingsGoal(id, goal, auth.getName());
        return ResponseEntity.ok(updatedGoal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavingsGoal(@PathVariable Long id, Authentication auth) {
        savingsGoalService.deleteSavingsGoal(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SavingsGoal>> getSavingsGoalsByStatus(
            @PathVariable String status, 
            Authentication auth) {
        List<SavingsGoal> goals = savingsGoalService.getSavingsGoalsByStatus(auth.getName(), status);
        return ResponseEntity.ok(goals);
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<Void> updateProgress(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            Authentication auth) {
        savingsGoalService.updateProgress(id, amount, auth.getName());
        return ResponseEntity.ok().build();
    }
}

