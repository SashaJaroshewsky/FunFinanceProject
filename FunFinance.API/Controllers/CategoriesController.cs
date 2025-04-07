using FunFinance.API.Models;
using FunFinance.API.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FunFinance.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // GET: api/Categories/ByFamily/5
        [HttpGet("ByFamily/{familyId}")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesByFamily(int familyId)
        {
            var categories = await _categoryService.GetCategoriesByFamilyIdAsync(familyId);
            return Ok(categories);
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] CategoryCreateDto createDto)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(
                    createDto.Name,
                    createDto.Description,
                    createDto.FamilyId);

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryUpdateDto updateDto)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                    return NotFound();

                category.Name = updateDto.Name ?? category.Name;
                category.Description = updateDto.Description ?? category.Description;

                var success = await _categoryService.UpdateCategoryAsync(category);
                if (!success)
                    return BadRequest("Не вдалося оновити категорію");

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var success = await _categoryService.DeleteCategoryAsync(id);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Categories/5/TotalExpenses
        [HttpGet("{id}/TotalExpenses")]
        public async Task<ActionResult<decimal>> GetTotalExpenses(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound();

            var total = await _categoryService.GetTotalExpensesForCategoryAsync(id);
            return Ok(total);
        }
    }

    // DTO класи для передачі даних
    public class CategoryCreateDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public int FamilyId { get; set; }
    }

    public class CategoryUpdateDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}