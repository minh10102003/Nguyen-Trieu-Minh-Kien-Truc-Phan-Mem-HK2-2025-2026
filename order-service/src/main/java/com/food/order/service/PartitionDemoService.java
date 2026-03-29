package com.food.order.service;

import com.food.order.model.User;
import com.food.order.model.UserBasic;
import com.food.order.model.UserDetail;
import com.food.order.model.UserFemale;
import com.food.order.model.UserMale;
import com.food.order.repository.UserBasicRepository;
import com.food.order.repository.UserDetailRepository;
import com.food.order.repository.UserFemaleRepository;
import com.food.order.repository.UserMaleRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class PartitionDemoService {

    private final JdbcTemplate jdbcTemplate;
    private final UserMaleRepository userMaleRepository;
    private final UserFemaleRepository userFemaleRepository;
    private final UserBasicRepository userBasicRepository;
    private final UserDetailRepository userDetailRepository;

    public PartitionDemoService(
            JdbcTemplate jdbcTemplate,
            UserMaleRepository userMaleRepository,
            UserFemaleRepository userFemaleRepository,
            UserBasicRepository userBasicRepository,
            UserDetailRepository userDetailRepository
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.userMaleRepository = userMaleRepository;
        this.userFemaleRepository = userFemaleRepository;
        this.userBasicRepository = userBasicRepository;
        this.userDetailRepository = userDetailRepository;
    }

    public String horizontalPartition(String name, String gender) {
        User user = new User(name, gender);
        saveUser(user);
        if ("male".equalsIgnoreCase(gender)) {
            return "Saved to user_male";
        }
        return "Saved to user_female";
    }

    /**
     * Horizontal partition demo:
     * If gender=male -> save into user_male, else into user_female.
     */
    public void saveUser(User user) {
        if ("male".equalsIgnoreCase(user.getGender())) {
            UserMale male = new UserMale();
            male.setName(user.getName());
            male.setGender(user.getGender());
            userMaleRepository.save(male);
            return;
        }

        UserFemale female = new UserFemale();
        female.setName(user.getName());
        female.setGender(user.getGender());
        userFemaleRepository.save(female);
    }

    public String verticalPartition(String name, String address) {
        Long id = jdbcTemplate.queryForObject("SELECT COALESCE(MAX(id), 0) + 1 FROM user_basic", Long.class);
        UserBasic basic = new UserBasic(id, name);
        UserDetail detail = new UserDetail(id, address);
        userBasicRepository.save(basic);
        userDetailRepository.save(detail);
        return "Saved to user_basic and user_detail with id=" + id;
    }

    public String functionPartition(String payload) {
        jdbcTemplate.update("INSERT INTO payment_data.audit_log(payload) VALUES (?)", payload);
        jdbcTemplate.update("INSERT INTO kitchen_data.audit_log(payload) VALUES (?)", payload);
        return "Saved to payment_data.audit_log and kitchen_data.audit_log";
    }
}
