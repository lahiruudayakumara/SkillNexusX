package com.example.server.service.user;

import com.example.server.DTO.user.UserResponseDTO;
import com.example.server.model.user.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User updateUser(Long id, User user);
    Optional<UserResponseDTO> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    void deleteUser(Long id);
}