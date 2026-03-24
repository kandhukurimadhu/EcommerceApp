package com.busybrains.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the BusyBrains E-Commerce application.
 * This application demonstrates:
 * - JWT Authentication
 * - Google SSO via OAuth 2.0
 * - Role-Based Access Control (RBAC)
 * - Product Management APIs
 * - User Profile Management
 */
@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }
}
