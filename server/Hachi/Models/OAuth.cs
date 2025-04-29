public class OAuth
{
    public Guid OAuthId { get; set; }          // Unique identifier for each OAuth entry
    public Guid UserId { get; set; }           // Foreign key to link to the user
    public string Provider { get; set; }       // OAuth provider (Google, Microsoft, etc.)
    public string ProviderEmail { get; set; }  // Email from OAuth provider
    public string ProviderUserId { get; set; } // OAuth provider-specific user ID

    public User User { get; set; }             // Navigation property to the user
}
