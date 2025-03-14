
using FunFinance.API.Data;
using FunFinance.API.Repositories;
using FunFinance.API.Services;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddDbContext<ApplicationDbContext>(options => 
                    options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IFamilyRepository, FamilyRepository>();
            builder.Services.AddScoped<IBudgetRepository, BudgetRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
            builder.Services.AddScoped<IFamilyInvitationRepository, FamilyInvitationRepository>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IFamilyService, FamilyService>();
            builder.Services.AddScoped<IBudgetService, BudgetService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IExpenseService, ExpenseService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
