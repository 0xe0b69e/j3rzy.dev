import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn (): JSX.Element
{
  return (
    <form
      action={async () =>
      {
        await signIn("google", { callbackUrl: "/files" });
      }}
    >
      <button
        type="submit"
        className="flex flex-row items-center space-x-2 xs:py-2 xs:px-6 py-1 px-4 border-[1px] rounded-lg border-background dark:border-background-dark hover:bg-primary transition-colors duration-150"
      >
        <FcGoogle className="w-8 h-8" />
        <p className="text-lg max-xs:hidden">Sign In with Google</p>
      </button>
    </form>
  );
}