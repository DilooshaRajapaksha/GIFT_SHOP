package com.example.GiftCraft_BackEnd.Security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/*
 * Stops someone from guessing the admin password over and over.
 * After 5 wrong passwords from the same computer (IP address) the login is
 * blocked for 15 minutes.
 */
@Service
public class LoginAttemptService {

    private static final int MAX_FAILS = 5;
    private static final long BLOCK_MS = 15L * 60 * 1000;

    private static class Attempts {
        int fails;
        long blockedUntil;
    }

    private final Map<String, Attempts> byIp = new ConcurrentHashMap<>();

    public boolean isBlocked(String ip) {
        Attempts a = byIp.get(ip);
        return a != null && a.blockedUntil > System.currentTimeMillis();
    }

    // minutes left, for the error message
    public long minutesLeft(String ip) {
        Attempts a = byIp.get(ip);
        if (a == null) return 0;
        long ms = a.blockedUntil - System.currentTimeMillis();
        return Math.max(1, (ms + 59_999) / 60_000);
    }

    public synchronized void failed(String ip) {
        Attempts a = byIp.computeIfAbsent(ip, k -> new Attempts());
        a.fails++;
        if (a.fails >= MAX_FAILS) {
            a.blockedUntil = System.currentTimeMillis() + BLOCK_MS;
            a.fails = 0;
        }
    }

    public void succeeded(String ip) {
        byIp.remove(ip);
    }
}
