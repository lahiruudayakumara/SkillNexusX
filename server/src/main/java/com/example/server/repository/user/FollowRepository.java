package com.example.server.repository.user;

import com.example.server.model.user.Follow;
import com.example.server.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowing(User following);
    void deleteByFollowerAndFollowing(User follower, User following);
}