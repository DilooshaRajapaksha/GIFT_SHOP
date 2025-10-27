
package com.giftcraft.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryCreateUpdateRequest {
    @NotBlank
    @Size(max = 50)
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public static class Response {
        private Long id;
        private String name;
        public Response() {}
        public Response(Long id, String name) { this.id = id; this.name = name; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
