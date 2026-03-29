package com.food.order.repository;

import com.food.order.model.UserBasic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBasicRepository extends JpaRepository<UserBasic, Long> {
}

