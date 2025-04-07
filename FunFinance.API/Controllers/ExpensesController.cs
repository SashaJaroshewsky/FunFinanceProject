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
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        // GET: api/Expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            var expenses = await _expenseService.GetAllExpensesAsync();
            return Ok(expenses);
        }

        // GET: api/Expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int id)
        {
            var expense = await _expenseService.GetExpenseByIdAsync(id);

            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        // GET: api/Expenses/ByUser/5
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByUser(int userId)
        {
            var expenses = await _expenseService.GetExpensesByUserIdAsync(userId);
            return Ok(expenses);
        }

        // GET: api/Expenses/ByBudget/5
        [HttpGet("ByBudget/{budgetId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByBudget(int budgetId)
        {
            var expenses = await _expenseService.GetExpensesByBudgetIdAsync(budgetId);
            return Ok(expenses);
        }

        // GET: api/Expenses/ByCategory/5
        [HttpGet("ByCategory/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByCategory(int categoryId)
        {
            var expenses = await _expenseService.GetExpensesByCategoryIdAsync(categoryId);
            return Ok(expenses);
        }

        // GET: api/Expenses/ByFamily/5
        [HttpGet("ByFamily/{familyId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByFamily(int familyId)
        {
            var expenses = await _expenseService.GetExpensesByFamilyIdAsync(familyId);
            return Ok(expenses);
        }

        // GET: api/Expenses/ByDateRange
        [HttpGet("ByDateRange")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByDateRange(
            [FromQuery] int familyId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var expenses = await _expenseService.GetExpensesByDateRangeAsync(familyId, startDate, endDate);
            return Ok(expenses);
        }

        // POST: api/Expenses
        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense([FromBody] ExpenseCreateDto createDto)
        {
            try
            {
                var expense = await _expenseService.CreateExpenseAsync(
                    createDto.Description,
                    createDto.Amount,
                    createDto.Date,
                    createDto.CategoryId,
                    createDto.UserId,
                    createDto.BudgetId);

                return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Expenses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseUpdateDto updateDto)
        {
            var expense = await _expenseService.GetExpenseByIdAsync(id);
            if (expense == null)
                return NotFound();

            if (!string.IsNullOrEmpty(updateDto.Description))
                expense.Description = updateDto.Description;

            if (updateDto.Amount.HasValue)
                expense.Amount = updateDto.Amount.Value;

            if (updateDto.Date.HasValue)
                expense.Date = updateDto.Date.Value;

            if (updateDto.CategoryId.HasValue)
                expense.CategoryId = updateDto.CategoryId.Value;

            var success = await _expenseService.UpdateExpenseAsync(expense);
            if (!success)
                return BadRequest("Не вдалося оновити витрату");

            return NoContent();
        }

        // DELETE: api/Expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var success = await _expenseService.DeleteExpenseAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // GET: api/Expenses/TotalByUser
        [HttpGet("TotalByUser")]
        public async Task<ActionResult<decimal>> GetTotalExpensesByUser(
            [FromQuery] int userId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var total = await _expenseService.GetTotalExpensesByUserAsync(userId, startDate, endDate);
            return Ok(total);
        }

        // GET: api/Expenses/TotalByCategory
        [HttpGet("TotalByCategory")]
        public async Task<ActionResult<decimal>> GetTotalExpensesByCategory(
            [FromQuery] int categoryId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var total = await _expenseService.GetTotalExpensesByCategoryAsync(categoryId, startDate, endDate);
            return Ok(total);
        }

        // GET: api/Expenses/GroupByCategory
        [HttpGet("GroupByCategory")]
        public async Task<ActionResult<IDictionary<int, decimal>>> GetExpensesByCategory(
            [FromQuery] int familyId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var groupedExpenses = await _expenseService.GetExpensesByCategory(familyId, startDate, endDate);
            return Ok(groupedExpenses);
        }

        // GET: api/Expenses/GroupByUser
        [HttpGet("GroupByUser")]
        public async Task<ActionResult<IDictionary<int, decimal>>> GetExpensesByUser(
            [FromQuery] int familyId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var groupedExpenses = await _expenseService.GetExpensesByUser(familyId, startDate, endDate);
            return Ok(groupedExpenses);
        }

        // GET: api/Expenses/GroupByDay
        [HttpGet("GroupByDay")]
        public async Task<ActionResult<IDictionary<DateTime, decimal>>> GetExpensesByDay(
            [FromQuery] int familyId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var groupedExpenses = await _expenseService.GetExpensesByDay(familyId, startDate, endDate);
            return Ok(groupedExpenses);
        }
    }

    // DTO класи для передачі даних
    public class ExpenseCreateDto
    {
        public required string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public int BudgetId { get; set; }
    }

    public class ExpenseUpdateDto
    {
        public required string Description { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? Date { get; set; }
        public int? CategoryId { get; set; }
    }
}