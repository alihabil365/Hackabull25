import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-gray-600">
            Join BarterSwap and start trading
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
