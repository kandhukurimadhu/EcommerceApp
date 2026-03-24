package com.busybrains.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Objects for authentication operations.
 */
public class AuthDtos {

    /**
     * Request body for user login.
     */
    @Data
    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;
    }

    /**
     * Request body for user registration.
     */
    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
        private String username;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        private String firstName;
        private String lastName;
    }

    /**
     * Response body after successful authentication.
     * Contains the JWT token and user info.
     */
    @Data
    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private String username;
        private String email;
        private String role;
        private String firstName;
        private String lastName;
        private String profilePicture;

        public AuthResponse(String token, String username, String email, String role,
                           String firstName, String lastName, String profilePicture) {
            this.token = token;
            this.username = username;
            this.email = email;
            this.role = role;
            this.firstName = firstName;
            this.lastName = lastName;
            this.profilePicture = profilePicture;
        }
    }
}
