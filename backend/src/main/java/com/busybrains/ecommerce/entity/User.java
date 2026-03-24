package com.busybrains.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User entity representing a registered user in the system.
 * Supports both form-based login and OAuth2/SSO login.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Username is required")
    private String username;

    /**
     * Password may be null for OAuth2 users (they authenticate via Google etc.)
     */
    private String password;

    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * OAuth2 provider (e.g., "google", "facebook") - null for form login users
     */
    private String provider;

    /**
     * OAuth2 provider's unique user ID
     */
    private String providerId;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;
}
