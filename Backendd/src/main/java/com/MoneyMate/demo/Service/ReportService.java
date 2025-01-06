package com.MoneyMate.demo.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MoneyMate.demo.Model.Expense;
import com.MoneyMate.demo.Model.User;

@Service
public class ReportService {
    private final ExpenseService expenseService;
    private final UserService userService;

    @Autowired
    public ReportService(ExpenseService expenseService, UserService userService) {
        this.expenseService = expenseService;
        this.userService = userService;
    }

    public Map<String, Object> generateMonthlyReport(String userEmail, int year, int month) {
        User user = userService.findUserByEmail(userEmail);
        List<Expense> expenses = expenseService.getUserExpenses(userEmail);

        // Filter expenses for the specified month
        List<Expense> monthlyExpenses = filterExpensesByMonth(expenses, year, month);

        Map<String, Object> report = new HashMap<>();
        report.put("totalExpenses", calculateTotalExpenses(monthlyExpenses));
        report.put("categoryBreakdown", calculateCategoryBreakdown(monthlyExpenses));
        report.put("dailyExpenses", calculateDailyExpenses(monthlyExpenses));
        report.put("topExpenses", findTopExpenses(monthlyExpenses, 5));
        report.put("generatedAt", LocalDateTime.now());

        return report;
    }

    public Map<String, Object> generateAnnualReport(String userEmail, int year) {
        User user = userService.findUserByEmail(userEmail);
        List<Expense> expenses = expenseService.getUserExpenses(userEmail);

        // Filter expenses for the specified year
        List<Expense> yearlyExpenses = filterExpensesByYear(expenses, year);

        Map<String, Object> report = new HashMap<>();
        report.put("totalExpenses", calculateTotalExpenses(yearlyExpenses));
        report.put("monthlyBreakdown", calculateMonthlyBreakdown(yearlyExpenses));
        report.put("categoryBreakdown", calculateCategoryBreakdown(yearlyExpenses));
        report.put("topExpenses", findTopExpenses(yearlyExpenses, 10));
        report.put("generatedAt", LocalDateTime.now());

        return report;
    }

    private List<Expense> filterExpensesByMonth(List<Expense> expenses, int year, int month) {
        return expenses.stream()
            .filter(e -> {
                LocalDateTime date = e.getDate();
                return date.getYear() == year && date.getMonthValue() == month;
            })
            .collect(Collectors.toList());
    }

    private List<Expense> filterExpensesByYear(List<Expense> expenses, int year) {
        return expenses.stream()
            .filter(e -> e.getDate().getYear() == year)
            .collect(Collectors.toList());
    }

    private BigDecimal calculateTotalExpenses(List<Expense> expenses) {
        return expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Map<String, BigDecimal> calculateCategoryBreakdown(List<Expense> expenses) {
        return expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.mapping(
                    Expense::getAmount,
                    Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
            ));
    }

    private Map<Integer, BigDecimal> calculateDailyExpenses(List<Expense> expenses) {
        return expenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getDate().getDayOfMonth(),
                Collectors.mapping(
                    Expense::getAmount,
                    Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
            ));
    }

    private Map<Integer, BigDecimal> calculateMonthlyBreakdown(List<Expense> expenses) {
        return expenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getDate().getMonthValue(),
                Collectors.mapping(
                    Expense::getAmount,
                    Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
            ));
    }

    private List<Expense> findTopExpenses(List<Expense> expenses, int limit) {
        return expenses.stream()
            .sorted((e1, e2) -> e2.getAmount().compareTo(e1.getAmount()))
            .limit(limit)
            .collect(Collectors.toList());
    }
}
