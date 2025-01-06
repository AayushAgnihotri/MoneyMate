package com.MoneyMate.demo.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.MoneyMate.demo.Model.Expense;
import com.MoneyMate.demo.Model.User;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    List<Expense> findByUserAndType(User user, String type);
    
    @Query("SELECT e FROM Expense e WHERE e.user = ?1 AND e.date BETWEEN ?2 AND ?3")
    List<Expense> findByUserAndDateBetween(User user, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = ?1 AND e.type = ?2")
    Double getTotalByUserAndType(User user, String type);
}
