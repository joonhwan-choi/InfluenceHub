package com.influencehub.backend.youtube.support;

import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;

public class YoutubeOnboardingContext {

    private final User user;
    private final CreatorRoom room;

    public YoutubeOnboardingContext(User user, CreatorRoom room) {
        this.user = user;
        this.room = room;
    }

    public User getUser() {
        return user;
    }

    public CreatorRoom getRoom() {
        return room;
    }
}
