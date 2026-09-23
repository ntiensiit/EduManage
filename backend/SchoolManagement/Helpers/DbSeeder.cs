using SchoolManagement.Context;
using SchoolManagement.Context.Tables;
using SchoolManagement.Helpers;

namespace SchoolManagement.Helpers
{
    public static class DbSeeder
    {
        public static void Seed(SchoolContext ctx)
        {
            ctx.Database.EnsureCreated();

            if (!ctx.Department.Any())
            {
                ctx.Department.AddRange(
                    new Department { Name = "Computer Science" },
                    new Department { Name = "Mathematics" }
                );
                ctx.SaveChanges();
            }

            if (!ctx.Teacher.Any())
            {
                ctx.Teacher.Add(new Teacher
                {
                    Name = "Admin",
                    Email = "admin@edu.com",
                    Password = StringCipher.Encrypt("Admin123!")
                });
                ctx.SaveChanges();
            }

            if (!ctx.Student.Any())
            {
                ctx.Student.Add(new Student
                {
                    Name = "Student",
                    Number = "S001",
                    Email = "student@edu.com",
                    Password = StringCipher.Encrypt("Student123!")
                });
                ctx.SaveChanges();
            }
        }
    }
}
