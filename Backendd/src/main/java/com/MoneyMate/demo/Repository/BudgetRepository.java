package com.MoneyMate.demo.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.MoneyMate.demo.Model.Budget;
import com.MoneyMate.demo.Model.User;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.category = :category")
    Budget findByUser_IdAndCategory(Long userId, String category);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId")
    List<Budget> findByUser_Id(Long userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user = :user")
    List<Budget> findByUser(User user);

    @Modifying
    @Query("UPDATE Budget b SET b.category = :category, b.description = :description, " +
           "b.amount = :amount, b.spentAmount = :spentAmount, " +
           "b.startDate = :startDate, b.endDate = :endDate, b.period = :period, " +
           "b.alertThreshold = :alertThreshold, b.status = :status, " +
           "b.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE b.id = :id AND b.user.id = :userId")
    void updateBudget(@Param("category") String category,
                     @Param("description") String description,
                     @Param("amount") BigDecimal amount,
                     @Param("spentAmount") BigDecimal spentAmount,
                     @Param("startDate") LocalDate startDate,
                     @Param("endDate") LocalDate endDate,
                     @Param("period") String period,
                     @Param("alertThreshold") Integer alertThreshold,
                     @Param("status") String status,
                     @Param("userId") Long userId,
                     @Param("id") Long id);
}


