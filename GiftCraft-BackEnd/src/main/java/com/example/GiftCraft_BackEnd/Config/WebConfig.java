package com.example.GiftCraft_BackEnd.Config;

import com.example.GiftCraft_BackEnd.Security.RateLimitInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // folder where the admin's uploaded images are saved (app.image-dir in application.properties)
    @Value("${app.image-dir}")
    private String imageDir;

    private final AdminAuthInterceptor adminAuthInterceptor;
    private final RateLimitInterceptor rateLimitInterceptor;

    public WebConfig(AdminAuthInterceptor adminAuthInterceptor, RateLimitInterceptor rateLimitInterceptor) {
        this.adminAuthInterceptor = adminAuthInterceptor;
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    /*
     * Images are saved as files in the uploads/images folder, and the database only stores
     * the link, e.g. "/images/1730000000000_abc.jpg".
     * This makes that link work: http://localhost:8082/images/<file name>
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path folder = Paths.get(imageDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/images/**")
                .addResourceLocations(folder.toUri().toString() + "/");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // every admin request needs a valid token (the login itself is the exception)
        registry.addInterceptor(adminAuthInterceptor)
                .addPathPatterns("/api/v1/admin/**")
                .excludePathPatterns("/api/v1/admin/login");

        // spam limits on the public endpoints that save things
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns("/api/orders/**", "/api/v1/giftboxes/**");
    }
}
