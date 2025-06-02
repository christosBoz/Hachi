public class NewFolderRequest
{
    public string Name { get; set; }
    public bool IsSchool { get; set; }
    public string? CourseCode { get; set; }
    public string? School { get; set; }

    // 👇 This lets you receive the image in the same request
    public IFormFile? File { get; set; }
}
