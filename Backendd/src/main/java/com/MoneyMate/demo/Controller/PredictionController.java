package com.MoneyMate.demo.Controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Service.PredictionService;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {
    private final PredictionService predictionService;

    @Autowired
    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyPredictions(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(predictionService.predictMonthlyExpenses(userEmail));
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalMonthlyPrediction(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(predictionService.predictTotalMonthlyExpense(userEmail));
    }

    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getSpendingInsights(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(predictionService.getSpendingInsights(userEmail));
    }
}
