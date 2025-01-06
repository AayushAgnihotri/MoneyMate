package com.MoneyMate.demo.Service;

import java.time.LocalDate;
import java.util.List;

import com.MoneyMate.demo.Model.Bill;

public interface BillService {
    Bill createBill(Bill bill, String userEmail);
    Bill updateBill(Long id, Bill bill, String userEmail);
    void deleteBill(Long id, String userEmail);
    List<Bill> getUserBills(String userEmail);
    List<Bill> getUpcomingBills(String userEmail, LocalDate date);
    List<Bill> getBillsByStatus(String userEmail, String status);
}

