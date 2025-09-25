import { LogIn } from "lucide-react";

export function UnauthorizedBanner() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-800">
      <LogIn className="h-4 w-4 shrink-0" />
      <div className="text-xs leading-snug">
        <span className="font-medium">Login required:</span>{" "}
        Please log in to Quercus, then return to this page.{" "}
        <a
          href="https://q.utoronto.ca/"
          target="_blank"
          rel="noreferrer"
          className="underline font-medium"
        >
          https://q.utoronto.ca/
        </a>
      </div>
    </div>
  );
}