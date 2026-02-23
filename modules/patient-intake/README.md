# Patient Intake Module

Multi-step patient intake funnel for telehealth applications.

## Features

- **6-Step Intake Funnel**: Demographics, Address, Insurance, Medical History, Consent, Review
- **Progress Tracking**: Visual progress bar and step-by-step navigation
- **File Upload**: Insurance card upload with preview
- **Medical History**: Multi-entry fields for conditions, medications, allergies
- **Consent Management**: Telehealth and HIPAA consent forms with modal viewers
- **Admin Management**: View and edit all patient intake records

## Routes

### Patient Routes

| Path | Description |
|------|-------------|
| `/intake` | Redirect to current step |
| `/intake/step/1` | Demographics form |
| `/intake/step/2` | Address form |
| `/intake/step/3` | Insurance form |
| `/intake/step/4` | Medical history (skippable) |
| `/intake/step/5` | Consent forms |
| `/intake/step/6` | Review & submit |

### Admin Routes

| Path | Description |
|------|-------------|
| `/admin/patients` | Patient list with intake status |
| `/admin/patients/:id` | Patient detail view/edit |

## Database Tables

### `patientIntake`

Main table storing all patient intake information:

- Demographics (name, DOB, contact info, physical measurements)
- Address
- Insurance details with file storage references
- Medical history (conditions, medications, allergies)
- Consent tracking
- Progress tracking (current step, completion status)

### `insuranceProviders`

Reference table for searchable insurance providers.

### `medicalConditions`

Reference table for searchable medical conditions.

## Components

### Patient Components

- `IntakeLayout` - Page layout with progress bar
- `ProgressBar` - Visual step indicator
- `DemographicsForm` - Step 1 form
- `AddressForm` - Step 2 form
- `InsuranceForm` - Step 3 form with file upload
- `MedicalHistoryForm` - Step 4 form with multi-entry fields
- `ConsentForm` - Step 5 form with consent checkboxes
- `ReviewStep` - Step 6 summary with edit capability
- `FileUpload` - Reusable file upload component
- `ConsentModal` - Modal for viewing consent documents

### Admin Components

- `PatientIntakeList` - Table of all patients
- `PatientIntakeDetail` - Detailed patient view with edit/delete
- `IntakeStatusBadge` - Status indicator badge
- `DocumentViewer` - View uploaded documents

## Convex Functions

### Patient Functions (`convex/modules/patientIntake/patientIntake.ts`)

- `getMyIntake` - Get current user's intake record
- `initializeIntake` - Create new intake record
- `updateDemographics` - Update step 1 data
- `updateAddress` - Update step 2 data
- `updateInsurance` - Update step 3 data
- `updateMedicalHistory` - Update step 4 data
- `skipMedicalHistory` - Skip step 4
- `updateConsent` - Update step 5 data
- `completeIntake` - Mark intake as complete
- `goToStep` - Navigate to specific step
- `getInsuranceProviders` - Get reference data
- `getMedicalConditions` - Get reference data
- `generateUploadUrl` - Get upload URL for files
- `getFileUrl` - Get URL for uploaded file

### Admin Functions (`convex/modules/patientIntake/admin.ts`)

- `listAllIntakes` - List all intake records
- `listIntakesByStatus` - Filter by completion status
- `getIntakeById` - Get single record
- `getIntakeByUserId` - Get record by user
- `getIntakeStats` - Get dashboard statistics
- `updateIntake` - Update any intake field
- `deleteIntake` - Delete intake record

### Seed Functions (`convex/modules/patientIntake/seed.ts`)

- `seedInsuranceProviders` - Seed insurance providers
- `seedMedicalConditions` - Seed medical conditions
- `seedAll` - Seed all reference data

## Setup

1. After installing the module, run the seed function to populate reference data:

```bash
npx convex run modules/patientIntake/seed:seedAll
```

2. The intake routes are protected and will redirect:
   - Patients without completed intake → `/intake`
   - Patients with completed intake → `/patient`
   - Admins → `/admin`

## Validation Rules

- Phone: Valid US phone format
- Email: Valid email format
- Zip code: 5 digits
- Date of birth: Must be in the past, patient must be 18+
- File uploads: Max 10MB, JPG/PNG/PDF only
- Both consent checkboxes required on step 5
