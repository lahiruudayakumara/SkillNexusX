package com.example.server.service.user;

import com.example.server.model.user.Follow;
import java.util.List;

public interface FollowService {

    List<Follow> getFollowers(Long userId);

    List<Follow> getFollowing(Long userId);

    void followUser(Long followerId, Long followingId);

    void unfollowUser(Long followerId, Long followingId);
}