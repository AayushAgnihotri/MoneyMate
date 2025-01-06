package com.MoneyMate.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MoneyMate.demo.Model.Category;
import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, UserService userService) {
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }

    @Override
    public Category createCategory(Category category, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        category.setUser(user);
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!existingCategory.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this category");
        }

        existingCategory.setName(category.getName());
        existingCategory.setType(category.getType());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setIcon(category.getIcon());

        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long id, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this category");
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public List<Category> getUserCategories(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        return categoryRepository.findByUser(user);
    }

    @Override
    public List<Category> getUserCategoriesByType(String userEmail, String type) {
        User user = userService.findUserByEmail(userEmail);
        return categoryRepository.findByUserAndType(user, type);
    }
} 