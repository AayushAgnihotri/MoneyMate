CREATE TABLE goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL,
    deadline DATE NOT NULL,
    monthly_saving DECIMAL(10,2) NOT NULL,
    category VARCHAR(255),
    priority VARCHAR(50) NOT NULL,
    created_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
); 