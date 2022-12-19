using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{

    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userMenager;
        private readonly IUnitOfWork _uow;
        private readonly IPhotoService _photoService;
        public AdminController(UserManager<AppUser> userMenager, IUnitOfWork uow, IPhotoService photoService)
        {
            _photoService = photoService;
            _uow = uow;
            _userMenager = userMenager;

        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userMenager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userMenager.FindByNameAsync(username);

            if (user == null) return NotFound();

            var userRoles = await _userMenager.GetRolesAsync(user);

            var result = await _userMenager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("failed to add to roles");

            result = await _userMenager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userMenager.GetRolesAsync(user));

        }

        // [Authorize(Policy = "ModeratePhotoRole")]
        // [HttpGet("photos-to-moderate")]
        // public ActionResult GetPhotosForModeration()
        // {
        //     return Ok("admin or moderacte can see");
        // }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult> GetPhotosForModeration()
        {
            var photos = await _uow.PhotoRepository.GetUnapprovedPhotos();
            return Ok(photos);
        }

        // [Authorize(Policy = "ModeratePhotoRole")]
        // [HttpPost("approve-photo/{photoId}")]
        // public async Task<ActionResult> ApprovePhoto(int photoId)
        // {
        //     var photo = await
        //    _uow.PhotoRepository.GetPhotoById(photoId);
        //     photo.isApproved = true;
        //     await _uow.Complete();
        //     return Ok();
        // }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approve-photo/{photoId}")]
        public async Task<ActionResult> ApprovePhoto(int photoId)
        {
            var photo = await
           _uow.PhotoRepository.GetPhotoById(photoId);
            if (photo == null) return NotFound("Could not find photo");
            photo.isApproved = true;
            var user = await
           _uow.UserRepository.GetUserByPhotoId(photoId);
            if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;
            await _uow.Complete();
            return Ok();
        }



        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("reject-photo/{photoId}")]
        public async Task<ActionResult> RejectPhoto(int photoId)
        {
            var photo = await
           _uow.PhotoRepository.GetPhotoById(photoId);
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Result == "ok")
                {
                    _uow.PhotoRepository.RemovePhoto(photo);
                }
            }
            else
            {
                _uow.PhotoRepository.RemovePhoto(photo);
            }
            await _uow.Complete();
            return Ok();
        }


    }
}