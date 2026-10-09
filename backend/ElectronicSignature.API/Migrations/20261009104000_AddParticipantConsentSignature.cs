using ElectronicSignature.API.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectronicSignature.API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20261009104000_AddParticipantConsentSignature")]
    public partial class AddParticipantConsentSignature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ParticipantSignatureData",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParticipantSignatureMethod",
                table: "ConsentForms",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParticipantSignatureData",
                table: "ConsentForms");

            migrationBuilder.DropColumn(
                name: "ParticipantSignatureMethod",
                table: "ConsentForms");
        }
    }
}
