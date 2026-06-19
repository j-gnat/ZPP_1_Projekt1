using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZPP_NJM_Soft.Server.Data.Entities;

public class Course
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    // Relacje: Kurs posiada wiele modułów
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
    public Course Course { get; set; } = null!;

    // Relacje: Moduł posiada wiele lekcji
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}

public class Lesson
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string VideoUrl { get; set; } = string.Empty; // Hosting video

    public string Content { get; set; } = string.Empty; // Opis lekcji lub HTML

    public int ModuleId { get; set; }
    
    [ForeignKey("ModuleId")]
    public Module Module { get; set; } = null!;
}

public class UserRole
{
    // Role: admin, instruktor, uczestnik
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string RoleName { get; set; } = string.Empty; 
}