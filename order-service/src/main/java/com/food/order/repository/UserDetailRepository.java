package com.food.order.repository;

import com.food.order.model.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {
}

