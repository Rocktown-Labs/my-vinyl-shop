import { ProfileForm } from "@/components/dashboard/forms/profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-4 sm:space-y-6 py-4 sm:py-6 px-4 sm:px-0 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your seller profile and information
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
