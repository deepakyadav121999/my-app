"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleBackendAuth = async (idToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to authenticate with backend");
      }

      const data = await response.json();

      setUserData(data.user); // Store user data in state
      router.push("/");
      // onLogin(data.access_token);
    } catch (error) {
      // console.error("Backend auth error:", error);
      alert("Failed to authenticate with backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.idToken) {
      handleBackendAuth(session.idToken);
    }
  }, [status, session]);

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };
  const handleSignOut = async () => {
    setUserData(null);
    await signOut();
  };
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <div className="flex gap-4"></div>
          {userData ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login with Google"}
            </button>
          )}
        </nav>

        <h1 className="text-2xl font-bold mb-6">Home Page</h1>

        {userData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-gray-600 mb-2">{userData.userName}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{userData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Access Level</p>
                    <p className="font-medium">{userData.userAccess}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch ID</p>
                    <p className="font-medium">
                      {userData.branchId || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!userData && (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-lg">Please sign in to view your profile</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
