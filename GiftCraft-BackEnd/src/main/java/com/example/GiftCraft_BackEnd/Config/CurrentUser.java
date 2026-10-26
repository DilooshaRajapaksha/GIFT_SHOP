package com.example.GiftCraft_BackEnd.Config;

/*
 * We don't have login yet, so every request is treated as user 1.
 * Before, "return 1L" was copied into 3 different services.
 * Now there is only this one place - when JWT login is added,
 * change id() to read the user from the token and everything else keeps working.
 */
public final class CurrentUser {

    private CurrentUser() {
    }

    public static Long id() {
        return 1L; // TODO: read from the JWT / SecurityContext after login is added
    }
}
