
package com.giftcraft.backend.domain;

public enum ProductVisibility {
    public_, private_;
    // DB stores 'public' or 'private'; we map 'public' to public_ because 'public' is a keyword in Java.
    public static ProductVisibility fromDb(String s) {
        if (s == null) return null;
        return "public".equalsIgnoreCase(s) ? public_ : private_;
    }
    public String toDb() {
        return this == public_ ? "public" : "private";
    }
}
