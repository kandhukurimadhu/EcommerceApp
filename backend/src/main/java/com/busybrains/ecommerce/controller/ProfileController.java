package com.busybrains.ecommerce.controller;

import com.busybrains.ecommerce.entity.User;
import com.busybrains.ecommerce.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * User profile management controller.
 *
 * Endpoints:
 * - GET  /api/profile           → Get current user's profile
 * - PUT  /api/profile           → Update profile info
 * - PUT  /api/profile/password  → Change password
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get authenticated user's profile.
     */
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(toProfileResponse(user));
    }

    /**
     * Update profile (firstName, lastName, email, phoneNumber).
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());

        // Email update: check uniqueness
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email already in use by another account"));
            }
            user.setEmail(request.getEmail());
        }

        userRepository.save(user);
        log.info("User '{}' updated their profile", user.getUsername());
        return ResponseEntity.ok(toProfileResponse(user));
    }

    /**
     * Change password. Requires current password for verification.
     */
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Current password is incorrect"));
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "New password must be at least 6 characters"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("User '{}' changed their password", user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private Map<String, Object> toProfileResponse(User user) {
        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                "lastName", user.getLastName() != null ? user.getLastName() : "",
                "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "",
                "role", user.getRole().name(),
                "profilePicture", user.getProfilePicture() != null ? user.getProfilePicture() : "",
                "provider", user.getProvider() != null ? user.getProvider() : "local"
        );
    }

    // ─── Request DTOs ─────────────────────────────────────────────────────────

    @Data
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}
