"use client";

import { Icon } from "@acmecorp/icons";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  progress?: any;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  progress,
}: OnboardingProgressProps) {
  const getStepStatus = (stepIndex: number) => {
    if (!progress?.progress) return "pending";

    const stepProgress = progress.progress[stepIndex];
    if (!stepProgress) return "pending";

    if (stepProgress.completed) return "completed";
    if (stepProgress.skipped) return "skipped";
    if (stepIndex === currentStep) return "current";

    return "pending";
  };

  const getStepIcon = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);

    switch (status) {
      case "completed":
        return <Icon name="check" className="w-4 h-4 text-white" />;
      case "skipped":
        return <Icon name="arrow-right" className="w-4 h-4 text-gray-400" />;
      case "current":
        return (
          <span className="text-sm font-medium text-white">
            {stepIndex + 1}
          </span>
        );
      default:
        return (
          <span className="text-sm font-medium text-gray-500">
            {stepIndex + 1}
          </span>
        );
    }
  };

  const getStepColor = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);

    switch (status) {
      case "completed":
        return "bg-green-500 border-green-500";
      case "skipped":
        return "bg-gray-300 border-gray-300";
      case "current":
        return "bg-blue-500 border-blue-500";
      default:
        return "bg-white border-gray-300";
    }
  };

  return (
    <div className="px-6 py-4 border-b bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepColor(index)}`}
              >
                {getStepIcon(index)}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`w-8 h-0.5 ${getStepStatus(index) === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex items-center justify-between mt-3">
        {["Welcome", "Organization", "Profile", "Tour", "Invite"].map(
          (label, index) => (
            <div
              key={index}
              className={`text-xs font-medium ${
                getStepStatus(index) === "current"
                  ? "text-blue-600"
                  : getStepStatus(index) === "completed"
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              {label}
            </div>
          )
        )}
      </div>
    </div>
  );
}
