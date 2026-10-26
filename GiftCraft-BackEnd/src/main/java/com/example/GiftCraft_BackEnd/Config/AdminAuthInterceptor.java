package com.example.GiftCraft_BackEnd.Config;

import com.example.GiftCraft_BackEnd.Security.AdminTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

/*
 * Protects every /api/v1/admin/** request (except the login itself).
 * The admin page must send:   Authorization: Bearer <token from /login>
 */
@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final AdminTokenService tokenService;

    public AdminAuthInterceptor(AdminTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // browsers send an OPTIONS "pre-flight" request first (CORS) - let it through
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")
                || !tokenService.isValid(header.substring(7).trim())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Please log in again");
        }
        return true;
    }
}
