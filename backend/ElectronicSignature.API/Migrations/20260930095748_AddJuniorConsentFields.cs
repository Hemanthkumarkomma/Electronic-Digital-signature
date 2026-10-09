using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectronicSignature.API.Migrations
{
    /// <inheritdoc />
    public partial class AddJuniorConsentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClubAffiliation",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClubChapterNumber",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClubName",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CountyDistrict",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "JuniorParticipationAgreement",
                table: "ConsentForms",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "JuniorRulesAgreement",
                table: "ConsentForms",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianAddress",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianCity",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ParentGuardianConsent",
                table: "ConsentForms",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianEmail",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianName",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianPhone",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianRelationship",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianState",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentGuardianZip",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClubAffiliation",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ClubChapterNumber",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ClubName",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "CountyDistrict",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "JuniorParticipationAgreement",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "JuniorRulesAgreement",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianAddress",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianCity",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianConsent",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianEmail",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianName",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianPhone",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianRelationship",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianState",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParentGuardianZip",
                table: "ConsentForms");
        }
    }
}
