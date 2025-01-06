package com.MoneyMate.demo.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.MoneyMate.demo.Model.Bill;
import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.BillRepository;

@Service
public class BillServiceImpl implements BillService {
    
    private final BillRepository billRepository;
    private final UserService userService;

    @Autowired
    public BillServiceImpl(BillRepository billRepository, UserService userService) {
        this.billRepository = billRepository;
        this.userService = userService;
    }

    @Override
    public Bill createBill(Bill bill, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        bill.setUser(user);
        return billRepository.save(bill);
    }

    @Override
    public Bill updateBill(Long id, Bill bill, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        Bill existingBill = billRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (!existingBill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this bill");
        }

        existingBill.setName(bill.getName());
        existingBill.setAmount(bill.getAmount());
        existingBill.setDueDate(bill.getDueDate());
        existingBill.setStatus(bill.getStatus());
        existingBill.setCategory(bill.getCategory());
        existingBill.setDescription(bill.getDescription());

        return billRepository.save(existingBill);
    }

    @Override
    public void deleteBill(Long id, String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        Bill bill = billRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (!bill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this bill");
        }

        billRepository.deleteById(id);
    }

    @Override
    public List<Bill> getUserBills(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        return billRepository.findByUser(user);
    }

    @Override
    public List<Bill> getUpcomingBills(String userEmail, LocalDate date) {
        User user = userService.findUserByEmail(userEmail);
        return billRepository.findUpcomingBills(user, date);
    }

    @Override
    public List<Bill> getBillsByStatus(String userEmail, String status) {
        User user = userService.findUserByEmail(userEmail);
        return billRepository.findByUserAndStatus(user, status);
    }
} 