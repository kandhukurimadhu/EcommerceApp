package com.busybrains.ecommerce.security;

import com.busybrains.ecommerce.entity.Role;
import com.busybrains.ecommerce.entity.User;
import com.busybrains.ecommerce.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    // Set FRONTEND_URL env var in Railway → e.g. https://your-app.up.railway.app
    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email     = oAuth2User.getAttribute("email");
        String name      = oAuth2User.getAttribute("name");
        String picture   = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");

        log.info("OAuth2 login success for email: {}", email);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            String username = email.split("@")[0];
            String finalUsername = username;
            int counter = 1;
            while (userRepository.existsByUsername(finalUsername)) {
                finalUsername = username + counter++;
            }

            return userRepository.save(User.builder()
                    .username(finalUsername)
                    .email(email)
                    .firstName(name != null ? name.split(" ")[0] : "")
                    .lastName(name != null && name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "")
                    .profilePicture(picture)
                    .role(Role.ROLE_USER)
                    .provider("google")
                    .providerId(providerId)
                    .enabled(true)
                    .build());
        });

        org.springframework.security.core.userdetails.UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername())
                        .password("")
                        .authorities(List.of(new SimpleGrantedAuthority(user.getRole().name())))
                        .build();

        String token = jwtUtils.generateToken(userDetails);

        // Use FRONTEND_URL env var — works for both local and Railway
        String redirectUrl = frontendUrl + "/oauth2/callback?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
