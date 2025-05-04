

    public class School
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Type { get; set; } // "College" or "K-12"

        public List<User> Users { get; set; }
    }

