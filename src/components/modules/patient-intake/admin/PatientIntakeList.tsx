import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { IntakeStatusBadge } from "./IntakeStatusBadge";
import { EyeIcon } from "lucide-react";

export function PatientIntakeList() {
  const navigate = useNavigate();
  const intakes = useQuery(api.modules.patientIntake.admin.listAllIntakes);

  if (intakes === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (intakes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No patient intake records found.
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm text-muted-foreground">
            <th className="py-3 px-4 font-medium">Patient Name</th>
            <th className="py-3 px-4 font-medium">Email</th>
            <th className="py-3 px-4 font-medium">Phone</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Created</th>
            <th className="py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {intakes.map((intake) => (
            <tr key={intake._id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                {intake.firstName && intake.lastName
                  ? `${intake.firstName} ${intake.lastName}`
                  : "—"}
              </td>
              <td className="py-3 px-4">{intake.email || "—"}</td>
              <td className="py-3 px-4">{intake.phone || "—"}</td>
              <td className="py-3 px-4">
                <IntakeStatusBadge
                  completed={intake.intakeCompleted}
                  step={intake.intakeStep}
                />
              </td>
              <td className="py-3 px-4">{formatDate(intake.createdAt)}</td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/patients/${intake._id}`)}
                >
                  <EyeIcon className="mr-1 h-4 w-4" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
