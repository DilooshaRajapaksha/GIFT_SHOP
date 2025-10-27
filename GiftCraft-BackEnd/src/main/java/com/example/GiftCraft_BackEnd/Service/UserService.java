package com.example.GiftCraft_BackEnd.Service;
import com.example.GiftCraft_BackEnd.DTO.LoginRequest;
import com.example.GiftCraft_BackEnd.DTO.ProfileUpdateRequest;
import com.example.GiftCraft_BackEnd.DTO.RegisterRequest;
import com.example.GiftCraft_BackEnd.DTO.UserProfileDTO;
import com.example.GiftCraft_BackEnd.Entity.Role;
import com.example.GiftCraft_BackEnd.Entity.User;
import com.example.GiftCraft_BackEnd.Entity.UserRole;
import com.example.GiftCraft_BackEnd.Repo.RoleRepository;
import com.example.GiftCraft_BackEnd.Repo.UserRepository;
import com.example.GiftCraft_BackEnd.Repo.UserRoleRepository;
import com.example.GiftCraft_BackEnd.Security.Jwt;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.util.*;

@Service
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private final Map<String, String> resetCodes = new HashMap<>();

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       UserRoleRepository userRoleRepository, PasswordEncoder passwordEncoder,
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public ResponseEntity<Map<String, String>> loginUser(LoginRequest loginRequest) {
    Optional<User> optionalUser = userRepository.findByEmailWithRoles(loginRequest.getEmail());
    if (optionalUser.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Email not found"));
    }

    User user = optionalUser.get();

    if (!user.isEnabled()) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Account is deactivated"));
    }

    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
    }

    String token = Jwt.generateToken(user.getEmail());
    String role = user.getUserRoles().stream()
            .map(ur -> ur.getRole().getName())
            .findFirst()
            .orElse("USER");

    return ResponseEntity.ok(Map.of("token", token, "role", role, "userId", user.getUserId().toString()));
}

    public ResponseEntity<String> registerUser(RegisterRequest register) {
        if (userRepository.existsByEmail(register.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        if (!register.getPassword().equals(register.getConfirmedPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        String password = register.getPassword();
        if (password.length() < 6 ||
            !password.matches(".*[A-Z].*") ||         
            !password.matches(".*[^a-zA-Z0-9].*")) {  
            return ResponseEntity.badRequest().body("Password must be at least 6 characters, include an uppercase letter and a symbol");
        }


        if (register.getPhoneNumber() == null || !register.getPhoneNumber().matches("\\d{10}")) {
            return ResponseEntity.badRequest().body("Phone number must be 10 digits");
        }

        User user = new User(
                register.getFname(),
                register.getLname(),
                register.getEmail(),
                passwordEncoder.encode(register.getPassword()),
                register.getAddress(),
                register.getPhoneNumber()
        );
        user.setCreatedTime(new Timestamp(System.currentTimeMillis()));
        User savedUser = userRepository.save(user);

        Set<String> requestedRoles = register.getRoles();
        if (requestedRoles == null || requestedRoles.isEmpty()) {
            requestedRoles = Set.of("USER"); // default role
        }

for (String roleName : requestedRoles) {
    Role role = roleRepository.findByName(roleName.toUpperCase())
            .orElseGet(() -> roleRepository.save(new Role(roleName.toUpperCase())));
    userRoleRepository.save(new UserRole(savedUser, role));
}

        return ResponseEntity.ok("registered successfully with ID: " + savedUser.getUserId());
    }

    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        String token = Jwt.extractTokenFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = Jwt.extractUsername(token);
        Optional<User> optionalUser = userRepository.findByEmailWithRoles(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();
        return ResponseEntity.ok(new UserProfileDTO(user));
    }

    public ResponseEntity<String> updateUserProfile(ProfileUpdateRequest updateRequest, HttpServletRequest request) {
        String token = Jwt.extractTokenFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = Jwt.extractUsername(token);
        Optional<User> optionalUser = userRepository.findByEmailWithRoles(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();
        user.getUserRoles().size(); 

        if (updateRequest.getCurrentPassword() == null || !passwordEncoder.matches(updateRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }


        user.setFirstName(updateRequest.getFname());
        user.setLastName(updateRequest.getLname());
        user.setAddress(updateRequest.getAddress());
        user.setPhoneNumber(updateRequest.getPhoneNumber());

    if (updateRequest.getNewPassword() != null && !updateRequest.getNewPassword().isBlank()) {
        if (!updateRequest.getNewPassword().equals(updateRequest.getConfirmNewPassword())) {
            return ResponseEntity.badRequest().body("New passwords do not match");
        }

        if (!updateRequest.getNewPassword().matches("^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$")) {
            return ResponseEntity.badRequest().body("New password must be at least 6 characters, include an uppercase letter and a symbol");
        }

        user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
    }
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    public ResponseEntity<String> deleteUserAccount(String currentPassword, HttpServletRequest request) {
        if (currentPassword == null || currentPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Current password is required");
        }

        String token = Jwt.extractTokenFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = Jwt.extractUsername(token);
        Optional<User> optionalUser = userRepository.findByEmailWithRoles(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password incorrect");
        }

        userRepository.delete(user);

        System.out.println("User " + email + " has been permanently deleted.");
        return ResponseEntity.ok("Account deleted successfully");


    }

    public ResponseEntity<String> requestResetCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");

        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        resetCodes.put(email, code);
        sendCode(email, code);
        return ResponseEntity.ok("Verification code sent to email");
    }

    public ResponseEntity<String> confirmReset(String email, String code, String newPassword, String confirmNewPassword) {
        if (!resetCodes.containsKey(email) || !resetCodes.get(email).equals(code)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired code");
        }

        if (!newPassword.equals(confirmNewPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetCodes.remove(email);
        return ResponseEntity.ok("Password reset successful");
    }

    public void sendCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Password Reset Code");
        message.setText("Use this code to reset your password: " + code);
        mailSender.send(message);
    }
}