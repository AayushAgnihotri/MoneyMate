package com.MoneyMate.demo.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.MoneyMate.demo.Model.Expense;

@Service
public class AIInsightService {
    
    @Value("${cohere.api.key}")
    private String apiKey;
    
    private final String COHERE_API_URL = "https://api.cohere.ai/v1/generate";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ExpenseService expenseService;
    
    // Cache to store insights for each user
    private final Map<String, Map<String, Object>> userInsightsCache = new ConcurrentHashMap<>();
    
    public AIInsightService(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    public Map<String, Object> getFinancialInsights(String userEmail, boolean refresh) {
        // If not refreshing and we have cached insights, return them
        if (!refresh && userInsightsCache.containsKey(userEmail)) {
            return userInsightsCache.get(userEmail);
        }
        
        // Generate new insights if refreshing or no cached data
        Map<String, Object> newInsights = generateFinancialInsights(userEmail);
        userInsightsCache.put(userEmail, newInsights);
        return newInsights;
    }

    private Map<String, Object> generateFinancialInsights(String userEmail) {
        try {
            List<Expense> expenses = expenseService.getUserExpenses(userEmail);
            if (expenses == null || expenses.isEmpty()) {
                return getDefaultInsights();
            }
            
            // Calculate financial metrics
            Map<String, Object> metrics = calculateFinancialMetrics(expenses);
            
            // Generate AI insights with metrics
            String prompt = createAnalysisPrompt(expenses, metrics);
            
            Map<String, Object> request = new HashMap<>();
            request.put("model", "command-nightly");
            request.put("prompt", prompt);
            request.put("max_tokens", 500);
            request.put("temperature", 0.7);
            request.put("k", 0);
            request.put("stop_sequences", List.of());
            request.put("return_likelihoods", "NONE");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                COHERE_API_URL,
                entity,
                Map.class
            );

            Map<String, Object> insights = parseAIResponse(response.getBody());
            // Add metrics to insights
            insights.putAll(metrics);
            
            return insights;
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate AI insights: " + e.getMessage());
        }
    }

    private Map<String, Object> getDefaultInsights() {
        return Map.of(
            "spendingAnalysis", "No spending data available yet. Start by adding your transactions.",
            "savingsOpportunities", "Add your expenses to get personalized savings recommendations.",
            "budgetRecommendations", "Create a budget to get started with financial planning.",
            "financialHealth", 50,
            "smartGoals", "Begin by setting your financial goals.",
            "riskAnalysis", "Add transaction data to receive a risk analysis.",
            "lastUpdated", LocalDateTime.now()
        );
    }

    private String createAnalysisPrompt(List<Expense> expenses, Map<String, Object> metrics) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a financial advisor. Analyze this financial data:\n\n");
        
        prompt.append(String.format("Total Income: $%.2f\n", metrics.get("totalIncome")));
        prompt.append(String.format("Total Expenses: $%.2f\n", metrics.get("totalExpenses")));
        prompt.append(String.format("Net Savings: $%.2f\n", metrics.get("netSavings")));
        
        // Add category breakdown
        @SuppressWarnings("unchecked")
        Map<String, Double> categoryDistribution = (Map<String, Double>) metrics.get("categoryDistribution");
        prompt.append("\nExpense Categories:\n");
        categoryDistribution.forEach((category, amount) -> 
            prompt.append(String.format("- %s: $%.2f\n", category, amount))
        );

        prompt.append("\nRespond with the following sections, keeping each section concise and specific:\n");
        prompt.append("Spending Patterns: [Your analysis of spending trends]\n");
        prompt.append("Savings Opportunities: [Specific ways to save money]\n");
        prompt.append("Budget Recommendations: [Specific budget advice]\n");
        prompt.append("Financial Health Score (0-100): [Single number between 0-100]\n");
        prompt.append("Smart Goals: [3 specific financial goals]\n");
        prompt.append("Risk Analysis: [Key financial risks and mitigation strategies]\n");

        return prompt.toString();
    }

    private Map<String, Object> calculateFinancialMetrics(List<Expense> expenses) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Calculate total income and expenses
        double totalIncome = expenses.stream()
            .filter(e -> "INCOME".equals(e.getType()))
            .mapToDouble(e -> e.getAmount().doubleValue())
            .sum();

        double totalExpenses = expenses.stream()
            .filter(e -> "EXPENSE".equals(e.getType()))
            .mapToDouble(e -> e.getAmount().doubleValue())
            .sum();

        // Calculate monthly trends
        Map<String, Double> monthlyTrends = expenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getDate().getMonth().toString(),
                Collectors.summingDouble(e -> e.getAmount().doubleValue())
            ));

        // Calculate category distribution
        Map<String, Double> categoryDistribution = expenses.stream()
            .filter(e -> "EXPENSE".equals(e.getType()))
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.summingDouble(e -> e.getAmount().doubleValue())
            ));

        metrics.put("totalIncome", totalIncome);
        metrics.put("totalExpenses", totalExpenses);
        metrics.put("netSavings", totalIncome - totalExpenses);
        metrics.put("monthlyTrends", monthlyTrends);
        metrics.put("categoryDistribution", categoryDistribution);
        
        return metrics;
    }

    private Map<String, Object> parseAIResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> generations = (List<Map<String, Object>>) response.get("generations");
            String content = (String) generations.get(0).get("text");
            
            Map<String, Object> insights = new HashMap<>();
            insights.put("strengths", extractSection(content, "Key Financial Strengths:"));
            insights.put("improvements", extractSection(content, "Areas for Improvement:"));
            insights.put("quickWins", extractSection(content, "Quick Wins:"));
            insights.put("longTermRecommendations", extractSection(content, "Long-term Recommendations:"));
            insights.put("interestingFacts", extractSection(content, "Interesting Facts:"));
            insights.put("lastUpdated", LocalDateTime.now());
            
            return insights;
        } catch (Exception e) {
            System.out.println("Raw response: " + response);
            e.printStackTrace();
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage());
        }
    }

    private String extractSection(String content, String sectionTitle) {
        try {
            int startIndex = content.indexOf(sectionTitle);
            if (startIndex == -1) return "No insights available";
            
            int endIndex = content.indexOf("\n", startIndex + sectionTitle.length());
            if (endIndex == -1) endIndex = content.length();
            
            return content.substring(startIndex + sectionTitle.length(), endIndex).trim();
        } catch (Exception e) {
            return "Error extracting insights";
        }
    }

    private int extractHealthScore(String content) {
        try {
            String scoreSection = extractSection(content, "Financial Health Score");
            String[] words = scoreSection.split("\\s+");
            for (String word : words) {
                if (word.matches("\\d+")) {
                    int score = Integer.parseInt(word);
                    return Math.min(100, Math.max(0, score));
                }
            }
            return 50;
        } catch (Exception e) {
            return 50;
        }
    }

    private String createDetailedPrompt(List<Expense> expenses, Map<String, Object> metrics) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("As a financial advisor, analyze this data and provide detailed insights:\n\n");
        
        double totalIncome = (double) metrics.get("totalIncome");
        double totalExpenses = (double) metrics.get("totalExpenses");
        double savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
        
        prompt.append(String.format("Financial Overview:\n"));
        prompt.append(String.format("- Monthly Income: $%.2f\n", totalIncome));
        prompt.append(String.format("- Monthly Expenses: $%.2f\n", totalExpenses));
        prompt.append(String.format("- Savings Rate: %.1f%%\n", savingsRate));
        
        @SuppressWarnings("unchecked")
        Map<String, Double> categoryDistribution = (Map<String, Double>) metrics.get("categoryDistribution");
        prompt.append("\nTop Spending Categories:\n");
        categoryDistribution.entrySet().stream()
            .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
            .limit(3)
            .forEach(entry -> 
                prompt.append(String.format("- %s: $%.2f\n", entry.getKey(), entry.getValue()))
            );

        prompt.append("\nProvide the following insights:\n");
        prompt.append("1. Key Financial Strengths: Identify 2-3 positive aspects\n");
        prompt.append("2. Areas for Improvement: List 2-3 specific areas to focus on\n");
        prompt.append("3. Quick Wins: Suggest 2-3 immediate actions for better finances\n");
        prompt.append("4. Long-term Recommendations: Provide 2-3 strategic suggestions\n");
        prompt.append("5. Interesting Facts: Share 2-3 interesting observations about spending patterns\n");
        
        return prompt.toString();
    }
} 