using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZPP_NJM_Soft.Server.Data;
using ZPP_NJM_Soft.Server.Data.Entities;

namespace ZPP_NJM_Soft.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignsController : ControllerBase
{
    private readonly AppDbContext _db;

    public CampaignsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<Campaign>>> GetAll(CancellationToken ct)
    {
        var campaigns = await _db.Campaigns
            .ToListAsync(ct);

        campaigns = campaigns
            .OrderByDescending(c => c.CreatedAt)
            .ToList();

        return campaigns;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Campaign>> GetById([FromRoute] int id, CancellationToken ct)
    {
        var campaign = await _db.Campaigns.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (campaign is null) return NotFound();
        return campaign;
    }

    public sealed record CreateCampaignRequest(
        string Name,
        string Type,
        string Status,
        int Sent,
        int Opened,
        DateTimeOffset? ScheduledFor,
        string? Subject,
        string Body);

    [HttpPost]
    public async Task<ActionResult<Campaign>> Create([FromBody] CreateCampaignRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required");

        if (string.IsNullOrWhiteSpace(request.Type))
            return BadRequest("Type is required");

        if (string.IsNullOrWhiteSpace(request.Status))
            return BadRequest("Status is required");

        if (string.IsNullOrWhiteSpace(request.Body))
            return BadRequest("Body is required");

        var entity = new Campaign
        {
            Name = request.Name.Trim(),
            Type = request.Type.Trim(),
            Status = request.Status.Trim(),
            Sent = request.Sent,
            Opened = request.Opened,
            ScheduledFor = request.ScheduledFor,
            Subject = string.IsNullOrWhiteSpace(request.Subject) ? null : request.Subject.Trim(),
            Body = request.Body,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _db.Campaigns.Add(entity);
        await _db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }
}
