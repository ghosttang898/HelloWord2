using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRespository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRespository, IMapper mapper)
        {
            _userRespository = userRespository;
            _mapper = mapper;
        }

        [HttpGet]
        // [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            //return Ok(await _userRespository.GetUsersAsync());
            var users = await _userRespository.GetMembersAsync();

            //var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

            return Ok(users);
        }

        // api/users/{id}
        // [Authorize]
        // [HttpGet("{id}")]
        // public async Task<ActionResult<MemberDto>> GetUser(int id)
        // {
        //     var user = await _userRespository.GetUserByIdAsync(id);

        //     return _mapper.Map<MemberDto>(user);
        // }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            // var user = await _userRespository.GetUserByUsernameAsync(username);

            // return _mapper.Map<MemberDto>(user);

            return await _userRespository.GetMemberAsync(username);
        }
    }
}