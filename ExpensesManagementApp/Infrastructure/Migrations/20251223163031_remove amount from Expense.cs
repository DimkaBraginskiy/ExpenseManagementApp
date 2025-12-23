using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpensesManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class removeamountfromExpense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Expense");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "Expense",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
