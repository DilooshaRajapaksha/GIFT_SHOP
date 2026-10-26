package com.example.GiftCraft_BackEnd.Security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.springframework.http.HttpStatus.TOO_MANY_REQUESTS;

/*
 * Simple spam protection for the public "write" endpoints (placing orders,
 * saving Build-Your-Own boxes). Without a login anyone could send thousands
 * of fake orders, so each IP address gets a limited number per 10 minutes.
 * Normal customers never get near these numbers.
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final long WINDOW_MS = 10L * 60 * 1000;

    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();
        int limit = path.startsWith("/api/orders") ? 10 : 40;   // orders are stricter
        String key = request.getRemoteAddr() + "|" + (path.startsWith("/api/orders") ? "order" : "box");

        long now = System.currentTimeMillis();
        Deque<Long> times = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (times) {
            while (!times.isEmpty() && now - times.peekFirst() > WINDOW_MS) {
                times.pollFirst();
            }
            if (times.size() >= limit) {
                throw new ResponseStatusException(TOO_MANY_REQUESTS,
                        "Too many requests. Please wait a few minutes and try again.");
            }
            times.addLast(now);
        }
        return true;
    }
}
