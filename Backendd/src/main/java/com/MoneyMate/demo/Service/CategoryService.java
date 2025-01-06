package com.MoneyMate.demo.Service;

import java.util.List;

import com.MoneyMate.demo.Model.Category;

public interface CategoryService {
    Category createCategory(Category category, String userEmail);
    Category updateCategory(Long id, Category category, String userEmail);
    void deleteCategory(Long id, String userEmail);
    List<Category> getUserCategories(String userEmail);
    List<Category> getUserCategoriesByType(String userEmail, String type);
} 