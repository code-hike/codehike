import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SignInButton, SignOutButton } from "./inputs";
import { App } from "./app";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <App>
      <div className="curtain fixed h-[50vh] bottom-0 bg-white w-[100vw]"></div>
      <div className="fixed flex flex-col h-full justify-center w-full">
        <div className="flex flex-col h-full gap-4 mx-auto">
          <div className="home-top flex-1 flex flex-col justify-end items-center gap-4 text-stone-800">
            <h2 className="bold text-2xl">
              Tell me about the coding challenge you're facing
            </h2>
          </div>

          <div style={{ height: "var(--input-container-height)" }} />

          <div className="home-bottom flex-1 flex flex-col justify-start items-center gap-6">
            <BottomPanel user={session?.user} />
          </div>
        </div>
      </div>
    </App>
  );
}

function BottomPanel({ user }: { user: any }) {
  return user ? (
    <>
      <ProgressBar percentage={20} />
      <div>
        Hi {user.login}, you've used 20/100 credits. <SignOutButton />.
      </div>
    </>
  ) : (
    <>
      <span>but first</span>
      <SignInButton />
    </>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-2 bg-neutral-200 rounded-md overflow-hidden w-full">
      <div
        className="h-full bg-neutral-400"
        style={{
          width: `${percentage}%`,
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
}
