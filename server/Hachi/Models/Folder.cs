public class Folder
{
    public Guid FolderId { get; set; }  // Changed from int to Guid
    public string Name { get; set; } = string.Empty;
    public string? PictureUrl { get; set; }
    public bool IsSchool { get; set; }
    public string? CourseCode { get; set; }
    public string? School { get; set; }

    public Guid UserId { get; set; }  // Already uuid, this is good
}
