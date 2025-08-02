import { BookOpenIcon } from "@heroicons/react/24/outline";

export function Branding() {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-primary p-2 rounded-lg">
        <BookOpenIcon className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
        superstudy
      </span>
    </div>
  );
}
