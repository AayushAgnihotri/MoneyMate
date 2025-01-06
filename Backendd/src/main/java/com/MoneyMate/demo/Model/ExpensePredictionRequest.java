package com.MoneyMate.demo.Model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ExpensePredictionRequest {
    private String category;
    private int monthsAhead;  // How many months ahead to predict
}
