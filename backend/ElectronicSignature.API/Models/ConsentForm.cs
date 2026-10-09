
using System;

namespace ElectronicSignature.API.Models
{
    public class ConsentForm
    {
        public int Id { get; set; }

        // Logged-in exhibitor
        public string UserId { get; set; } = string.Empty;

        // Junior / Open
        public string ExhibitorType { get; set; } = string.Empty;

        // Event Information
        public string EventName { get; set; } = string.Empty;
        public string EventLocation { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
        public string Organization { get; set; } = string.Empty;

        // Exhibitor Information
        public string ParticipantFullName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public int? Age { get; set; }
        public string ParticipantPhone { get; set; } = string.Empty;
        public string ParticipantEmail { get; set; } = string.Empty;
        public string ParticipantAddress { get; set; } = string.Empty;
        public string ParticipantCity { get; set; } = string.Empty;
        public string ParticipantState { get; set; } = string.Empty;
        public string ParticipantZip { get; set; } = string.Empty;

        // Junior exhibitor information; null for Open submissions.
        public string? ClubAffiliation { get; set; }
        public string? ClubName { get; set; }
        public string? ClubChapterNumber { get; set; }
        public string? CountyDistrict { get; set; }
        public string? ParentGuardianName { get; set; }
        public string? ParentGuardianRelationship { get; set; }
        public string? ParentGuardianPhone { get; set; }
        public string? ParentGuardianEmail { get; set; }
        public string? ParentGuardianAddress { get; set; }
        public string? ParentGuardianCity { get; set; }
        public string? ParentGuardianState { get; set; }
        public string? ParentGuardianZip { get; set; }
        public bool? ParentGuardianConsent { get; set; }
        public bool? JuniorParticipationAgreement { get; set; }
        public bool? JuniorRulesAgreement { get; set; }

        // Animal Information
        public string AnimalTypes { get; set; } = string.Empty;
        public string OtherAnimalType { get; set; } = string.Empty;
        public string AnimalName { get; set; } = string.Empty;
        public string Species { get; set; } = string.Empty;
        public string ExhibitorRole { get; set; } = string.Empty;
        public string OtherRole { get; set; } = string.Empty;

        // Safety / Medical
        public bool SafetyAgreed { get; set; }
        public string Allergies { get; set; } = string.Empty;
        public string SpecialAssistance { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public string PreferredHospital { get; set; } = string.Empty;

        // Consent
        public bool ConsentAgreed { get; set; }

        // Digital Signature
        public string SignatureMethod { get; set; } = string.Empty;
        public string SignatureData { get; set; } = string.Empty;
        public string? ParticipantSignatureMethod { get; set; }
        public string? ParticipantSignatureData { get; set; }

        // Final Review
        public bool FinalConsent { get; set; }

        // Submission Information
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Submitted";
    }
}