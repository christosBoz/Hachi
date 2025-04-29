public class User
{
    public Guid UserId { get; set; }             // Unique user identifier
    public string Email { get; set; }            // User's email
    public string Username { get; set; }         // Custom username
    public DateTime? Birthday { get; set; }      // User's birthday (nullable)
    public string School { get; set; }           // School (nullable)
    public DateTime AccountCreationDate { get; set; } // Account creation date
    public string AvatarChoice { get; set; }     // Avatar choice (e.g., customizable options)
}

