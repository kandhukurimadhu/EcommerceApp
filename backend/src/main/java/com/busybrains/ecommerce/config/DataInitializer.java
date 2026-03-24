package com.busybrains.ecommerce.config;

import com.busybrains.ecommerce.entity.Product;
import com.busybrains.ecommerce.entity.Role;
import com.busybrains.ecommerce.entity.User;
import com.busybrains.ecommerce.repository.ProductRepository;
import com.busybrains.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Data initializer that runs on application startup.
 * Creates predefined users (admin and user) and sample product data.
 *
 * Predefined Users:
 * - admin / password  → ROLE_ADMIN (full CRUD on products)
 * - user  / password  → ROLE_USER  (view-only)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initUsers();
        initProducts();
    }

    private void initUsers() {
        // Admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password"))
                    .email("admin@busybrains.com")
                    .firstName("Admin")
                    .lastName("User")
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Created admin user: admin/password");
        }

        // Regular user
        if (!userRepository.existsByUsername("user")) {
            User regularUser = User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("password"))
                    .email("user@busybrains.com")
                    .firstName("Regular")
                    .lastName("User")
                    .role(Role.ROLE_USER)
                    .enabled(true)
                    .build();
            userRepository.save(regularUser);
            log.info("Created regular user: user/password");
        }
    }

    private void initProducts() {
        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .name("Apple iPhone 15 Pro")
                    .description("Latest iPhone with A17 Pro chip, titanium design, and USB-C connectivity.")
                    .price(new BigDecimal("134900"))
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400")
                    .stock(50)
                    .rating(4.8)
                    .reviewCount(2341)
                    .build());

            productRepository.save(Product.builder()
                    .name("Samsung Galaxy S24 Ultra")
                    .description("200MP camera, built-in S Pen, Snapdragon 8 Gen 3 processor.")
                    .price(new BigDecimal("129999"))
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1706439222399-9d0e20d70043?w=400")
                    .stock(35)
                    .rating(4.7)
                    .reviewCount(1876)
                    .build());

            productRepository.save(Product.builder()
                    .name("Sony WH-1000XM5 Headphones")
                    .description("Industry-leading noise canceling with 30-hour battery life.")
                    .price(new BigDecimal("29990"))
                    .category("Audio")
                    .imageUrl("https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400")
                    .stock(80)
                    .rating(4.9)
                    .reviewCount(5621)
                    .build());

            productRepository.save(Product.builder()
                    .name("MacBook Air M3")
                    .description("Supercharged by M3 chip. Up to 18 hours of battery life.")
                    .price(new BigDecimal("114900"))
                    .category("Computers")
                    .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400")
                    .stock(25)
                    .rating(4.9)
                    .reviewCount(3102)
                    .build());

            productRepository.save(Product.builder()
                    .name("Nike Air Max 270")
                    .description("Lifestyle shoe with the tallest Air unit yet for a bold look and feel.")
                    .price(new BigDecimal("12995"))
                    .category("Footwear")
                    .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400")
                    .stock(120)
                    .rating(4.5)
                    .reviewCount(8934)
                    .build());

            productRepository.save(Product.builder()
                    .name("Levi's 501 Original Jeans")
                    .description("The original straight jeans that started it all. 100% cotton.")
                    .price(new BigDecimal("4999"))
                    .category("Clothing")
                    .imageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d?w=400")
                    .stock(200)
                    .rating(4.4)
                    .reviewCount(12450)
                    .build());

            productRepository.save(Product.builder()
                    .name("Instant Pot Duo 7-in-1")
                    .description("Multi-use pressure cooker, slow cooker, rice cooker, steamer, sauté pan.")
                    .price(new BigDecimal("7999"))
                    .category("Kitchen")
                    .imageUrl("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400")
                    .stock(65)
                    .rating(4.6)
                    .reviewCount(45678)
                    .build());

            productRepository.save(Product.builder()
                    .name("Kindle Paperwhite")
                    .description("Waterproof e-reader with glare-free display and weeks of battery life.")
                    .price(new BigDecimal("13999"))
                    .category("Books & E-readers")
                    .imageUrl("https://images.unsplash.com/photo-1510906594845-bc082582c8cc?w=400")
                    .stock(90)
                    .rating(4.7)
                    .reviewCount(23456)
                    .build());

            log.info("Initialized {} sample products", productRepository.count());
        }
    }
}
