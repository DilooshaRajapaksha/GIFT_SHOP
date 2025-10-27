package com.example.GiftCraft_BackEnd.Security;
import com.example.GiftCraft_BackEnd.Entity.User;
import com.example.GiftCraft_BackEnd.Entity.UserRole;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;  

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.equals("/login") || path.equals("/register") || path.startsWith("/api/public")) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = Jwt.extractEmail(request);  
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (userDetails instanceof User user) {
                    var userRoles = user.getUserRoles();
                    List<org.springframework.security.core.GrantedAuthority> authorities;
                    
                    if (userRoles != null && !userRoles.isEmpty()) {
                        authorities = userRoles.stream()
                                .map(ur -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + ur.getRole().getName()))
                                .collect(Collectors.toList());
                    } else {
                        authorities = List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")); 
                    }

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);  
                }
            } catch (UsernameNotFoundException e) {
                System.err.println("User not found: " + email);
            }
        }

        filterChain.doFilter(request, response);
    }
}