using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZPP_NJM_Soft.Server.Data;
using ZPP_NJM_Soft.Server.Data.Entities;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _context;
    public CoursesController(AppDbContext context) => _context = context;

    [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses.ToListAsync();
        }

        // GET: api/courses/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
         var course = await _context.Courses
            .AsSplitQuery() 
            .Include(c => c.Modules)          
                .ThenInclude(m => m.Lessons)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
        {
            return NotFound(new { message = $"Kurs o ID {id} nie istnieje." });
        }

        return Ok(course);
    }    
}