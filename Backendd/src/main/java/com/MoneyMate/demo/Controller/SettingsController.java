package com.MoneyMate.demo.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Service.UserService;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    private static final Logger logger = LoggerFactory.getLogger(SettingsController.class);
    private final UserService userService;

    @Autowired
    public SettingsController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/currency")
    public ResponseEntity<Map<String, String>> getCurrency(Authentication authentication) {
        String userEmail = authentication.getName();
        String currency = userService.getUserCurrency(userEmail);
        return ResponseEntity.ok(Map.of("currency", currency));
    }

    @PostMapping("/currency")
    public ResponseEntity<?> updateCurrency(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            String currency = request.get("currency");
            
            logger.info("Currency update request received - User: {}, Currency: {}", userEmail, currency);
            
            if (currency == null || currency.trim().isEmpty()) {
                logger.warn("Invalid currency request - Currency is null or empty");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Currency is required", "details", "Currency value cannot be empty"));
            }
            
            userService.updateUserCurrency(userEmail, currency);
            logger.info("Currency successfully updated - User: {}, Currency: {}", userEmail, currency);
            
            return ResponseEntity.ok(Map.of(
                "currency", currency,
                "message", "Currency updated successfully"
            ));
            
        } catch (Exception e) {
            logger.error("Currency update failed - Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Failed to update currency",
                    "message", e.getMessage(),
                    "details", e.getClass().getSimpleName()
                ));
        }
    }
} 