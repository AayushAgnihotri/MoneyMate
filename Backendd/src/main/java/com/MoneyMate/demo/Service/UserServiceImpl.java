package com.MoneyMate.demo.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.MoneyMate.demo.Model.User;
import com.MoneyMate.demo.Repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        logger.info("User registered: {}", savedUser.getEmail());
        return savedUser;
    }

    @Override
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        logger.debug("Password check - matches: {}", matches);
        return matches;
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
        logger.info("User found: {}", user.getEmail());
        return user;
    }

    @Override
    public String getUserCurrency(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCurrency();
    }

    @Override
    public void updateUserCurrency(String userEmail, String currency) {
        try {
            logger.info("Starting currency update process for user: {}", userEmail);
            
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> {
                    logger.error("User not found for currency update: {}", userEmail);
                    return new RuntimeException("User not found: " + userEmail);
                });
            
            logger.info("Found user, current currency: {}, new currency: {}", 
                user.getCurrency(), currency);
            
            user.setCurrency(currency);
            userRepository.save(user);
            
            logger.info("Currency successfully updated in database for user: {}", userEmail);
            
        } catch (Exception e) {
            logger.error("Failed to update currency - User: {}, Error: {}", 
                userEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to update currency: " + e.getMessage(), e);
        }
    }
} 