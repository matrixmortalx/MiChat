-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class io.socket.** { *; }
-keep class retrofit2.** { *; }
-keep class okhttp3.** { *; }
-keep class com.squareup.okhttp3.** { *; }

-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**
-dontwarn io.socket.**
-dontwarn retrofit2.**
-dontwarn okhttp3.**
-dontwarn com.squareup.okhttp3.**

# Keep model classes
-keep class com.michat.app.models.** { *; }

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep R classes
-keepclassmembers class **.R$* {
    public static <fields>;
}
