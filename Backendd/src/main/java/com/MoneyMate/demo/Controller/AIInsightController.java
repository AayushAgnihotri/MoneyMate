package com.MoneyMate.demo.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Service.AIInsightService;

@RestController
@RequestMapping("/api/ai-insights")
public class AIInsightController {
    
    private static final Logger logger = LoggerFactory.getLogger(AIInsightController.class);
    private final AIInsightService aiInsightService;
    
    @Autowired
    public AIInsightController(AIInsightService aiInsightService) {
        this.aiInsightService = aiInsightService;
    }
    
    @GetMapping
    public ResponseEntity<?> getFinancialInsights(
            Authentication auth,
            @RequestParam(defaultValue = "false") boolean refresh) {
        try {
            if (auth == null) {
                logger.error("Authentication is null");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
            }

            logger.info("Getting insights for user: {}, refresh: {}", auth.getName(), refresh);
            Map<String, Object> insights = aiInsightService.getFinancialInsights(auth.getName(), refresh);
            
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            logger.error("Error getting insights: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to get insights: " + e.getMessage()));
        }
    }
} 