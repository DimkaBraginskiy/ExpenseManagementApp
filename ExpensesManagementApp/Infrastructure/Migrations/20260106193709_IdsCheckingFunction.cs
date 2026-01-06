using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpensesManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class IdsCheckingFunction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Expense_GuestSessionId",
                table: "Expense",
                column: "GuestSessionId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Expense_Owner_Exclusive",
                table: "Expense",
                sql: "(\"UserId\" IS NOT NULL AND \"GuestSessionId\" IS NULL) OR (\"UserId\" IS NULL AND \"GuestSessionId\" IS NOT NULL)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Expense_GuestSessionId",
                table: "Expense");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Expense_Owner_Exclusive",
                table: "Expense");
        }
    }
}
