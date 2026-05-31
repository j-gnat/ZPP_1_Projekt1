using System.ComponentModel.DataAnnotations;

namespace ZPP_NJM_Soft.Server.Data.Entities;

public class Campaign
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Type { get; set; } = "Email";

    [MaxLength(20)]
    public string Status { get; set; } = "draft";

    public int Sent { get; set; }

    public int Opened { get; set; }

    public DateTimeOffset? ScheduledFor { get; set; }

    [MaxLength(200)]
    public string? Subject { get; set; }

    public string Body { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
