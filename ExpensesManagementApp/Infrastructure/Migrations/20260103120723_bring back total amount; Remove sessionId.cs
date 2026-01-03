using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpensesManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class bringbacktotalamountRemovesessionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessionId",
                table: "Expense");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "Expense",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Expense");

            migrationBuilder.AddColumn<Guid>(
                name: "SessionId",
                table: "Expense",
                type: "uuid",
                nullable: true);
        }
    }
}
