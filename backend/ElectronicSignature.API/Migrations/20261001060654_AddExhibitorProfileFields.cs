using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectronicSignature.API.Migrations
{
    /// <inheritdoc />
    public partial class AddExhibitorProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Exhibitors",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClubAffiliation",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClubChapterNumber",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClubName",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountyDistrict",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "Exhibitors",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianEmail",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianName",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianPhone",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianRelationship",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Exhibitors",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ClubAffiliation",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ClubChapterNumber",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ClubName",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "CountyDistrict",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ParentGuardianEmail",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ParentGuardianName",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ParentGuardianPhone",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "ParentGuardianRelationship",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Exhibitors");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Exhibitors");
        }
    }
}
