using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectronicSignature.API.Migrations
{
    /// <inheritdoc />
    public partial class AddConsentForms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConsentForms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExhibitorType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Organization = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParticipantFullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Age = table.Column<int>(type: "int", nullable: true),
                    ParticipantPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParticipantEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParticipantAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParticipantCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParticipantState = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParticipantZip = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnimalTypes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OtherAnimalType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnimalName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Species = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExhibitorRole = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OtherRole = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SafetyAgreed = table.Column<bool>(type: "bit", nullable: false),
                    Allergies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpecialAssistance = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContactName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PreferredHospital = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConsentAgreed = table.Column<bool>(type: "bit", nullable: false),
                    SignatureMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SignatureData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FinalConsent = table.Column<bool>(type: "bit", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsentForms", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsentForms");
        }
    }
}
