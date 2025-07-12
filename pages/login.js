import { signIn } from "next-auth/react";
import Head from "next/head";

export default function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/admin",
      username: e.target.username.value,
      password: e.target.password.value,
    });
  };

  return (
    <>
      <Head>
        <title>Login | Quiz Admin</title>
        <meta name="description" content="Admin login for Quiz App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 to-white text-gray-800">
        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="username" className="block mb-1 font-medium text-gray-700">
                  Username
                </label>
                <input
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                🔐 Login
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-600 border-t bg-white">
          All rights reserved © VRG @2025
        </footer>
      </div>
    </>
  );
}
