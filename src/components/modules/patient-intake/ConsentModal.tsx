import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface ConsentModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  type: "telehealth" | "hipaa";
}

export function ConsentModal({ open, onClose, title, type }: ConsentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-2xl max-h-[80vh] mx-4 bg-background rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] px-6 py-4">
          {type === "telehealth" ? (
            <TelehealthConsentContent />
          ) : (
            <HIPAAConsentContent />
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function TelehealthConsentContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <h3>Telehealth Informed Consent</h3>

      <h4>Introduction</h4>
      <p>
        Telehealth involves the use of electronic communications to enable health care providers at different locations to share individual patient medical information for the purpose of improving patient care. This may include consultation, diagnosis, treatment, transfer of medical data, education, and other services.
      </p>

      <h4>Benefits of Telehealth</h4>
      <ul>
        <li>Improved access to medical care by enabling a patient to remain at home or work while the physician consults</li>
        <li>More efficient medical evaluation and management</li>
        <li>Obtaining expertise of a distant specialist</li>
      </ul>

      <h4>Possible Risks of Telehealth</h4>
      <ul>
        <li>Information transmitted may not be sufficient to allow for appropriate medical decision making</li>
        <li>Delays in medical evaluation and treatment could occur due to deficiencies or failures of the equipment</li>
        <li>Security protocols could fail, causing a breach of privacy of personal medical information</li>
        <li>A lack of access to complete medical records may result in adverse drug interactions or allergic reactions</li>
      </ul>

      <h4>Patient Consent</h4>
      <p>
        I understand that I have the right to withhold or withdraw my consent to the use of telehealth in the course of my care at any time without affecting my right to future care or treatment.
      </p>
      <p>
        I understand that I have the right to inspect all information obtained and recorded in the course of a telehealth interaction, and may receive copies of this information for a reasonable fee.
      </p>
      <p>
        I understand that a variety of alternative methods of medical care may be available to me, and that I may choose one or more of these at any time.
      </p>
      <p>
        I understand that telehealth may involve electronic communication of my personal medical information to other medical practitioners who may be located in other areas, including out of state.
      </p>
      <p>
        I understand that it is my duty to inform my healthcare provider of electronic interactions regarding my care that I may have with other healthcare providers.
      </p>

      <h4>Emergency Situations</h4>
      <p>
        I understand that telehealth services are not intended to address emergency medical situations. In case of an emergency, I should call 911 or go to the nearest emergency room.
      </p>
    </div>
  );
}

function HIPAAConsentContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <h3>HIPAA Authorization for Use and Disclosure of Protected Health Information</h3>

      <h4>Purpose</h4>
      <p>
        This authorization permits our healthcare organization to use and disclose your protected health information (PHI) as described below.
      </p>

      <h4>What Information May Be Used or Disclosed</h4>
      <p>
        The following categories of information may be used or disclosed:
      </p>
      <ul>
        <li>Medical history and physical examination findings</li>
        <li>Diagnoses, treatment plans, and progress notes</li>
        <li>Laboratory and diagnostic test results</li>
        <li>Medication records</li>
        <li>Insurance and billing information</li>
        <li>Demographic information</li>
      </ul>

      <h4>Who May Receive the Information</h4>
      <p>
        Your PHI may be disclosed to:
      </p>
      <ul>
        <li>Healthcare providers involved in your care</li>
        <li>Insurance companies for payment purposes</li>
        <li>Healthcare operations as needed for quality improvement</li>
        <li>As required by law</li>
      </ul>

      <h4>Your Rights</h4>
      <p>
        <strong>Right to Revoke:</strong> You have the right to revoke this authorization at any time by providing written notice. However, revocation will not affect any actions taken before your revocation is received.
      </p>
      <p>
        <strong>Right to Refuse:</strong> You have the right to refuse to sign this authorization. Your refusal will not affect your ability to receive treatment, though it may affect your ability to participate in telehealth services.
      </p>
      <p>
        <strong>Right to Copy:</strong> You have the right to receive a copy of this authorization.
      </p>

      <h4>Expiration</h4>
      <p>
        This authorization will remain in effect until you revoke it in writing or for a period of one year from the date of signature, whichever occurs first.
      </p>

      <h4>Re-disclosure</h4>
      <p>
        Information disclosed pursuant to this authorization may be subject to re-disclosure by the recipient and may no longer be protected by federal privacy regulations.
      </p>

      <h4>Questions</h4>
      <p>
        If you have any questions about this authorization or your privacy rights, please contact our Privacy Officer.
      </p>
    </div>
  );
}
