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
    public class FamiliesController : ControllerBase
    {
        private readonly IFamilyService _familyService;

        public FamiliesController(IFamilyService familyService)
        {
            _familyService = familyService;
        }

        // GET: api/Families
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Family>>> GetFamilies()
        {
            var families = await _familyService.GetAllFamiliesAsync();
            return Ok(families);
        }

        // GET: api/Families/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Family>> GetFamily(int id)
        {
            var family = await _familyService.GetFamilyByIdAsync(id);

            if (family == null)
                return NotFound();

            return Ok(family);
        }

        // GET: api/Families/5/Members
        [HttpGet("{id}/Members")]
        public async Task<ActionResult<Family>> GetFamilyWithMembers(int id)
        {
            var family = await _familyService.GetFamilyWithMembersAsync(id);

            if (family == null)
                return NotFound();

            return Ok(family);
        }

        // POST: api/Families
        [HttpPost]
        public async Task<ActionResult<Family>> CreateFamily([FromBody] FamilyCreateDto createDto)
        {
            try
            {
                var family = await _familyService.CreateFamilyAsync(
                    createDto.Name,
                    createDto.CreatorUserId);

                return CreatedAtAction(nameof(GetFamily), new { id = family.Id }, family);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Families/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFamily(int id, [FromBody] FamilyUpdateDto updateDto)
        {
            var family = await _familyService.GetFamilyByIdAsync(id);
            if (family == null)
                return NotFound();

            family.Name = updateDto.Name;

            var success = await _familyService.UpdateFamilyAsync(family);
            if (!success)
                return BadRequest("Не вдалося оновити сім'ю");

            return NoContent();
        }

        // DELETE: api/Families/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFamily(int id)
        {
            var success = await _familyService.DeleteFamilyAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // POST: api/Families/5/SendInvitation
        [HttpPost("{familyId}/SendInvitation")]
        public async Task<ActionResult<string>> SendInvitation(int familyId, [FromBody] InvitationCreateDto createDto)
        {
            try
            {
                var token = await _familyService.CreateInvitationAsync(familyId, createDto.Email);
                return Ok(new { token });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/Families/AcceptInvitation
        [HttpPost("AcceptInvitation")]
        public async Task<IActionResult> AcceptInvitation([FromBody] InvitationAcceptDto acceptDto)
        {
            var success = await _familyService.AcceptInvitationAsync(acceptDto.Token, acceptDto.UserId);
            if (!success)
                return BadRequest("Не вдалося прийняти запрошення");

            return NoContent();
        }

        // GET: api/Families/5/Invitations
        [HttpGet("{familyId}/Invitations")]
        public async Task<ActionResult<IEnumerable<FamilyInvitation>>> GetInvitationsByFamily(int familyId)
        {
            var invitations = await _familyService.GetInvitationsByFamilyIdAsync(familyId);
            return Ok(invitations);
        }

        // GET: api/Families/Invitations/ByEmail
        [HttpGet("Invitations/ByEmail")]
        public async Task<ActionResult<IEnumerable<FamilyInvitation>>> GetInvitationsByEmail([FromQuery] string email)
        {
            var invitations = await _familyService.GetInvitationsByEmailAsync(email);
            return Ok(invitations);
        }
    }

    // DTO класи для передачі даних
    public class FamilyCreateDto
    {
        public required string Name { get; set; }
        public int CreatorUserId { get; set; }
    }

    public class FamilyUpdateDto
    {
        public required string Name { get; set; }
    }

    public class InvitationCreateDto
    {
        public required string Email { get; set; }
    }

    public class InvitationAcceptDto
    {
        public required string Token { get; set; }
        public int UserId { get; set; }
    }
}