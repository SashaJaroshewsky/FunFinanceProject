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
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetService _budgetService;

        public BudgetsController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }

        // GET: api/Budgets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgets()
        {
            var budgets = await _budgetService.GetAllBudgetsAsync();
            return Ok(budgets);
        }

        // GET: api/Budgets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> GetBudget(int id)
        {
            var budget = await _budgetService.GetBudgetByIdAsync(id);

            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        // GET: api/Budgets/5/WithExpenses
        [HttpGet("{id}/WithExpenses")]
        public async Task<ActionResult<Budget>> GetBudgetWithExpenses(int id)
        {
            var budget = await _budgetService.GetBudgetWithExpensesAsync(id);

            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        // GET: api/Budgets/ByFamily/5
        [HttpGet("ByFamily/{familyId}")]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgetsByFamily(int familyId)
        {
            var budgets = await _budgetService.GetBudgetsByFamilyIdAsync(familyId);
            return Ok(budgets);
        }

        // GET: api/Budgets/Active/5
        [HttpGet("Active/{familyId}")]
        public async Task<ActionResult<IEnumerable<Budget>>> GetActiveBudgets(int familyId)
        {
            var budgets = await _budgetService.GetActiveBudgetsAsync(familyId);
            return Ok(budgets);
        }

        // POST: api/Budgets
        [HttpPost]
        public async Task<ActionResult<Budget>> CreateBudget([FromBody] BudgetCreateDto createDto)
        {
            try
            {
                var budget = await _budgetService.CreateBudgetAsync(
                    createDto.Name,
                    createDto.Limit,
                    createDto.StartDate,
                    createDto.EndDate,
                    createDto.FamilyId);

                return CreatedAtAction(nameof(GetBudget), new { id = budget.Id }, budget);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Budgets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, [FromBody] BudgetUpdateDto updateDto)
        {
            var budget = await _budgetService.GetBudgetByIdAsync(id);
            if (budget == null)
                return NotFound();

            budget.Name = updateDto.Name ?? budget.Name;

            if (updateDto.Limit.HasValue)
                budget.Limit = updateDto.Limit.Value;

            if (updateDto.StartDate.HasValue)
                budget.StartDate = updateDto.StartDate.Value;

            if (updateDto.EndDate.HasValue)
                budget.EndDate = updateDto.EndDate.Value;

            var success = await _budgetService.UpdateBudgetAsync(budget);
            if (!success)
                return BadRequest("Не вдалося оновити бюджет");

            return NoContent();
        }

        // DELETE: api/Budgets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var success = await _budgetService.DeleteBudgetAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // GET: api/Budgets/5/Usage
        [HttpGet("{id}/Usage")]
        public async Task<ActionResult<decimal>> GetBudgetUsage(int id)
        {
            try
            {
                var usage = await _budgetService.GetBudgetUsageAsync(id);
                return Ok(usage);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Budgets/5/Remaining
        [HttpGet("{id}/Remaining")]
        public async Task<ActionResult<decimal>> GetRemainingBudget(int id)
        {
            try
            {
                var remaining = await _budgetService.GetRemainingBudgetAsync(id);
                return Ok(remaining);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Budgets/5/IsExceeded
        [HttpGet("{id}/IsExceeded")]
        public async Task<ActionResult<bool>> IsBudgetExceeded(int id)
        {
            try
            {
                var isExceeded = await _budgetService.IsBudgetExceededAsync(id);
                return Ok(isExceeded);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Budgets/5/IsNearLimit
        [HttpGet("{id}/IsNearLimit")]
        public async Task<ActionResult<bool>> IsBudgetNearLimit(int id, [FromQuery] decimal threshold = 80)
        {
            try
            {
                var isNearLimit = await _budgetService.IsBudgetNearLimitAsync(id, threshold);
                return Ok(isNearLimit);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    // DTO класи для передачі даних
    public class BudgetCreateDto
    {
        public required string Name { get; set; }
        public decimal Limit { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int FamilyId { get; set; }
    }

    public class BudgetUpdateDto
    {
        public required string Name { get; set; }
        public decimal? Limit { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}