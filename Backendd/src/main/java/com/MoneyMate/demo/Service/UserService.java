package com.MoneyMate.demo.Service;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.MoneyMate.demo.Model.User;

public interface UserService extends UserDetailsService {
    User saveUser(User user);
    boolean checkPassword(String rawPassword, String encodedPassword);
    User findUserByEmail(String email);
    String getUserCurrency(String userEmail);
    void updateUserCurrency(String userEmail, String currency);
}
