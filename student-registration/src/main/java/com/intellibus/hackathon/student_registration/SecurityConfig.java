package com.intellibus.hackathon.student_registration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll() // Allow H2 Console
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable()) // Disable CSRF for H2 Console
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())) // Fixes deprecated
                                                                                                  // method
                .formLogin(form -> form.defaultSuccessUrl("/dashboard", true).permitAll()) // Fixes deprecated method
                .logout(logout -> logout.logoutSuccessUrl("/login").permitAll()); // Adds logout support

        return http.build();
    }
}
