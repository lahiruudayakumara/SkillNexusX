package com.example.server.service.user;

import com.example.server.DTO.user.FollowDTO;
import com.example.server.DTO.user.UserResponseDTO;
import com.example.server.model.user.User;
import com.example.server.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(userDetails.getEmail());
                    user.setUsername(userDetails.getUsername());
                    user.setFullName(userDetails.getFullName());
                    user.setPassword(userDetails.getPassword());
                    user.setProvider(userDetails.getProvider());
                    user.setProviderId(userDetails.getProviderId());
                    user.setEnabled(userDetails.isEnabled());
                    user.setVerified(userDetails.isVerified());
                    user.setVerificationToken(userDetails.getVerificationToken());
                    user.setProfilePic(userDetails.getProfilePic());
                    user.setCoverPhoto(userDetails.getCoverPhoto());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findById(id).map(user -> {
            List<FollowDTO> followers = user.getFollowers().stream()
                    .map(f -> new FollowDTO(
                            f.getFollower().getId(),
                            f.getFollower().getFullName(),
                            f.getFollower().getProfilePic()
                    ))
                    .collect(Collectors.toList());

            List<FollowDTO> following = user.getFollowing().stream()
                    .map(f -> new FollowDTO(
                            f.getFollowing().getId(),
                            f.getFollowing().getFullName(),
                            f.getFollowing().getProfilePic()
                    ))
                    .collect(Collectors.toList());

            UserResponseDTO dto = new UserResponseDTO();
            dto.setId(user.getId());
            dto.setEmail(user.getEmail());
            dto.setUsername(user.getUsername());
            dto.setProvider(user.getProvider());
            dto.setFullName(user.getFullName());
            dto.setEnabled(user.isEnabled());
            dto.setVerified(user.isVerified());
            dto.setFollowers(followers);
            dto.setFollowing(following);
            return dto;
        });
    }


    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(Math.toIntExact(id));
    }
}