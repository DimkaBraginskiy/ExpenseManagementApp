using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpensesManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class removeassociationentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Expense_Product");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Product",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Product");

            migrationBuilder.CreateTable(
                name: "Expense_Product",
                columns: table => new
                {
                    ExpenseId = table.Column<int>(type: "integer", nullable: false),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expense_Product", x => new { x.ExpenseId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_Expense_Product_Expense_ExpenseId",
                        column: x => x.ExpenseId,
                        principalTable: "Expense",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Expense_Product_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expense_Product_ProductId",
                table: "Expense_Product",
                column: "ProductId");
        }
    }
}
