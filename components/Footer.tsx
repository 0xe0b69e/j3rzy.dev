import { ArrowUpIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Footer (): JSX.Element
{
  return (
    <footer className="w-full flex justify-center items-center fixed bottom-0">
      <Link
        href="https://github.com/0xe0b69e/j3rzy.dev"
        target="_blank"
        className="flex items-center space-x-1 translate-y-10 hover:translate-y-0 transition-all duration-300 ease-in-out hover:shadow-2xl p-2 rounded-md rounded-b-none shadow-sm bg-gray-800 text-white"
      >
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full rounded-b-none text-white flex items-center justify-center p-1">
          <ArrowUpIcon className="w-6 h-6" />
        </div>
        <GitHubLogoIcon className="h-[1cch]" />
        <p>Source Code</p>
      </Link>
    </footer>
  );
}