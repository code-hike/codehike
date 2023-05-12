import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      className=" text-white px-3 py-2 flex gap-3 rounded bg-slate-900 hover:bg-slate-700 cursor-pointer pointer-events-auto  "
      onClick={() => signIn("github")}
    >
      <img
        height="24"
        width="24"
        src="https://authjs.dev/img/providers/github-dark.svg"
      />
      Sign in with GitHub
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className=" text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
      onClick={() => signOut()}
      style={{ backgroundColor: "#24292e" }}
    >
      Sign out
    </button>
  );
}
