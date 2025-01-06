package com.MoneyMate.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.MoneyMate.demo.Model.SavingsGoal;
import com.MoneyMate.demo.Model.User;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    List<SavingsGoal> findByUser(User user);
    List<SavingsGoal> findByUserAndStatus(User user, String status);
}
