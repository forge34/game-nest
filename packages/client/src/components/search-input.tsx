import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./ui/input";
import { Search } from "lucide-react";

type SearchInputProps = InputProps & {
  className?: string;
};
function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div
      className={cn(
        "relative w-fit max-w-2xl items-center rounded-md",
        "border border-input",
        "focus:border-primary-500 focus:ring-0",
        className,
      )}
    >
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 " />
      <Input
        type="text"
        placeholder="Search"
        autoComplete="off"
        autoCorrect="off"
        className="w-full border-none border-transparent bg-transparent pl-5 outline-none ring-transparent ring-offset-transparent focus-within:ring-0 focus:border-none focus:ring-0"
        {...props}
      />
    </div>
  );
}

export default SearchInput;
