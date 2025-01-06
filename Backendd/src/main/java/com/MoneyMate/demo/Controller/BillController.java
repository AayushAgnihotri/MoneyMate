package com.MoneyMate.demo.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoneyMate.demo.Model.Bill;
import com.MoneyMate.demo.Service.BillService;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    
    private final BillService billService;

    @Autowired
    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill, Authentication auth) {
        Bill newBill = billService.createBill(bill, auth.getName());
        return ResponseEntity.ok(newBill);
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getUserBills(Authentication auth) {
        List<Bill> bills = billService.getUserBills(auth.getName());
        return ResponseEntity.ok(bills);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @RequestBody Bill bill, Authentication auth) {
        Bill updatedBill = billService.updateBill(id, bill, auth.getName());
        return ResponseEntity.ok(updatedBill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id, Authentication auth) {
        billService.deleteBill(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Bill>> getUpcomingBills(Authentication auth) {
        List<Bill> bills = billService.getUpcomingBills(auth.getName(), LocalDate.now().plusDays(7));
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bill>> getBillsByStatus(@PathVariable String status, Authentication auth) {
        List<Bill> bills = billService.getBillsByStatus(auth.getName(), status);
        return ResponseEntity.ok(bills);
    }
}

