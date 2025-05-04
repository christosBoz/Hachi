public class UserProfileUpdateRequest
{
    public string Username { get; set; }
    public string Birthday { get; set; }
    public string School { get; set; }
    public string AvatarChoice { get; set; }  // Make this nullable if it's optional

    public bool Teacher {get; set;}
}
