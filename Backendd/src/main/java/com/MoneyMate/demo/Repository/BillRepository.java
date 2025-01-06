package com.MoneyMate.demo.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.MoneyMate.demo.Model.Bill;
import com.MoneyMate.demo.Model.User;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUser(User user);
    
    @Query("SELECT b FROM Bill b WHERE b.user = ?1 AND b.dueDate <= ?2 AND b.status = 'PENDING'")
    List<Bill> findUpcomingBills(User user, LocalDate date);
    
    List<Bill> findByUserAndStatus(User user, String status);
}

