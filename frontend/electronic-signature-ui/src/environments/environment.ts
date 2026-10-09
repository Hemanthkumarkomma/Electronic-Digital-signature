// Centralized environment configuration. apiUrl is sourced from the ASP.NET Core
// Online Layer's HTTPS profile defined in backend/ElectronicSignature.API/Properties/launchSettings.json.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5022/api',
};
