package com.example.GiftCraft_BackEnd;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Bean;

// UserDetailsService is excluded: we don't use Spring's user/password login,
// so it would only print a random "generated security password" on start-up
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class GiftCraftBackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(GiftCraftBackEndApplication.class, args);
	}

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
