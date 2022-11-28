using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRespository;
        private readonly ILikesRepository _likesRespository;
        public LikesController(IUserRepository userRespository, ILikesRepository likesRespository)
        {
            _likesRespository = likesRespository;
            _userRespository = userRespository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var soureceUserId = User.GetUserId();
            var likedUser = await _userRespository.GetUserByUsernameAsync(username);
            var soureceUser = await _likesRespository.GetUserWithLikes(soureceUserId);

            if (likedUser == null) return NotFound();

            if (soureceUser.UserName == username) return BadRequest("You Can't Like yourself");

            var userLike = await _likesRespository.GetUserLike(soureceUserId, likedUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceUserId = soureceUserId,
                LikeUserId = likedUser.Id
            };

            soureceUser.LikedUsers.Add(userLike);
            if (await _userRespository.SaveAllasync()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            // Console.Write(likesParams.UserId);
            likesParams.UserId = User.GetUserId();
            // Console.Write("****************************************************************" + likesParams.Predicate);
            var users = await _likesRespository.GetUserLikes(likesParams);
            // Response.AddpainationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            Response.AddpainationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }

    }
}