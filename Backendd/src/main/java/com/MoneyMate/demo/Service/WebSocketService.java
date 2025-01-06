package com.MoneyMate.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.MoneyMate.demo.Model.Transaction;
import com.MoneyMate.demo.websocket.TransactionWebSocketHandler;

@Service
public class WebSocketService {
    
    @Autowired
    private TransactionWebSocketHandler webSocketHandler;
    
    public void notifyTransactionUpdate(Transaction transaction) {
        webSocketHandler.broadcastTransaction(transaction);
    }
} 