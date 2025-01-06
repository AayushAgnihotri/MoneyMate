package com.MoneyMate.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.MoneyMate.demo.Model.Goal;
import com.MoneyMate.demo.Model.User;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
    List<Goal> findByUserOrderByDeadlineAsc(User user);
} 