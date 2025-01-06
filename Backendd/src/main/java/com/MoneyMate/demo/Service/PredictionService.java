package com.MoneyMate.demo.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MoneyMate.demo.Model.Expense;

@Service
public class PredictionService {
    private final ExpenseService expenseService;
    private final UserService userService;

    @Autowired
    public PredictionService(ExpenseService expenseService, UserService userService) {
        this.expenseService = expenseService;
        this.userService = userService;
    }

    public Map<String, BigDecimal> predictMonthlyExpenses(String userEmail) {
        List<Expense> expenses = expenseService.getUserExpenses(userEmail);

        // Group expenses by category and calculate average monthly spending
        return expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.mapping(
                    Expense::getAmount,
                    Collectors.reducing(
                        BigDecimal.ZERO,
                        BigDecimal::add
                    )
                )
            ));
    }

    public BigDecimal predictTotalMonthlyExpense(String userEmail) {
        Map<String, BigDecimal> categoryPredictions = predictMonthlyExpenses(userEmail);
        return categoryPredictions.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Map<String, Object> getSpendingInsights(String userEmail) {
        List<Expense> expenses = expenseService.getUserExpenses(userEmail);
        
        // Calculate various insights
        BigDecimal totalSpent = expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Find top spending categories
        Map<String, BigDecimal> categorySpending = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.mapping(
                    Expense::getAmount,
                    Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
            ));

        // Calculate month-over-month growth
        BigDecimal monthOverMonthGrowth = calculateMonthOverMonthGrowth(expenses);

        return Map.of(
            "totalSpent", totalSpent,
            "categorySpending", categorySpending,
            "monthOverMonthGrowth", monthOverMonthGrowth,
            "lastUpdated", LocalDateTime.now()
        );
    }

    private BigDecimal calculateMonthOverMonthGrowth(List<Expense> expenses) {
        if (expenses == null || expenses.isEmpty()) {
            return BigDecimal.ZERO;
        }

        // Group expenses by month and calculate monthly totals
        Map<YearMonth, BigDecimal> monthlyTotals = expenses.stream()
            .collect(Collectors.groupingBy(
                expense -> YearMonth.from(expense.getDate()),
                Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
            ));

        // Calculate average month-over-month growth
        return calculateAverageGrowth(monthlyTotals);
    }

    private BigDecimal calculateAverageGrowth(Map<YearMonth, BigDecimal> monthlyTotals) {
        // Implement average growth calculation logic
        // This is a simplified example
        return BigDecimal.ZERO; // Placeholder
    }
}
