package com.busybrains.ecommerce.entity;

/**
 * Roles available in the system.
 * ADMIN: Full CRUD on products, can manage users
 * USER:  Read-only access to products
 */
public enum Role {
    ROLE_ADMIN,
    ROLE_USER
}
