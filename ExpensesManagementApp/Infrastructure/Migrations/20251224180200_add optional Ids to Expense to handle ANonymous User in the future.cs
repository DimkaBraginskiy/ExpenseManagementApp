using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpensesManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class addoptionalIdstoExpensetohandleANonymousUserinthefuture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expense_AspNetUsers_UserId",
                table: "Expense");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Expense",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<Guid>(
                name: "SessionId",
                table: "Expense",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Expense_AspNetUsers_UserId",
                table: "Expense",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expense_AspNetUsers_UserId",
                table: "Expense");

            migrationBuilder.DropColumn(
                name: "SessionId",
                table: "Expense");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Expense",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Expense_AspNetUsers_UserId",
                table: "Expense",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
