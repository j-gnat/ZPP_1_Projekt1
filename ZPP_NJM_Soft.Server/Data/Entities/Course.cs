using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZPP_NJM_Soft.Server.Data.Entities;

public class Course
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public ICollection<Module> Modules { get; set; } = new List<Module>();
}

public class Module
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public int Order { get; set; }

    public int CourseId { get; set; }
    
    [ForeignKey("CourseId")]
    [JsonIgnore]
    public Course Course { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}

public class Lesson
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string VideoUrl { get; set; } = string.Empty; 

    public string Content { get; set; } = string.Empty; 

    public int ModuleId { get; set; }
    
    [ForeignKey("ModuleId")]
    [JsonIgnore]
    public Module Module { get; set; } = null!;
}

public class UserRole
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string RoleName { get; set; } = string.Empty; 
}

public class UserProgress {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int LessonId { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}