using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZPP_NJM_Soft.Server.Data;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _context;
    public CoursesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var courses = await _context.Courses.ToListAsync();
        return Ok(courses);
    }
}