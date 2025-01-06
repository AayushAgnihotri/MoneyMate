package com.MoneyMate.demo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.MoneyMate.demo.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Method to find a user by their email address
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u.currency FROM User u WHERE u.email = ?1")
    String findCurrencyByEmail(String email);
}
