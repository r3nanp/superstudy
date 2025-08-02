import { cn } from "@/lib/cn";

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn(className, "animate-spin")}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="text-current opacity-20"
      cx="12"
      cy="12"
      fill="none"
      r="10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="4"
      strokeWidth="4"
    />
    <circle
      className="text-current"
      cx="12"
      cy="12"
      fill="none"
      r="10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="4"
      strokeWidth="4"
      style={{ strokeDasharray: "20.9439, 41,8879" }}
    />
  </svg>
);

export { Spinner };
