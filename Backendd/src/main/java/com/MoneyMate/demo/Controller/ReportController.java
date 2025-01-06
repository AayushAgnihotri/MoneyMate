package com.MoneyMate.demo.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlyReport(
            @PathVariable int year,
            @PathVariable int month,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reportService.generateMonthlyReport(userEmail, year, month));
    }

    @GetMapping("/annual/{year}")
    public ResponseEntity<Map<String, Object>> getAnnualReport(
            @PathVariable int year,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reportService.generateAnnualReport(userEmail, year));
    }
}
