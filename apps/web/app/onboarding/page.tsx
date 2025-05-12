import { Completed, ProfileSetup, Tutorial, Welcome } from "@/components/onboarding";
import { Step, StepForm } from "@/components/ui/step-form";
import { redirect } from "next/navigation";

export default function Onboarding() {
  const steps: Step[] = [
    {
      title: 'Welcome',
      description: 'Welcome to W Fits.',
      content: <Welcome />
    },
    {
      title: 'Setup Your Profile',
      description: 'Finish setting up your account with some extra information.',
      content: <ProfileSetup />
    },
    {
      title: 'Tutorial',
      description: 'Learn how to use W Fits. ',
      content: <Tutorial />
    }
  ];

  const handleComplete = async () => {
    "use server";
    // TODO: update prisma.user to set onboarded to `true`
  }

  return (
    <div className="">
      <StepForm
        steps={steps}
        completedContent={<Completed />}
        onComplete={handleComplete}
      />
    </div>
  );
}
