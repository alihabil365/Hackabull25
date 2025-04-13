"use client";

// React
import { useEffect } from "react";

// Clerk
import { UserButton, useUser } from "@clerk/nextjs";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Components
import AddItemDialog from "./components/AddItemDialog";
import DashboardBody from "./components/DashboardBody";

export default function DashboardPage() {
  const { user } = useUser();
  const supabase = createClient();

  const checkAndCreateUser = async () => {
    if (!user) return;

    const { id, emailAddresses, firstName, lastName, imageUrl } = user;

    try {
      // Check if the user exists in the Supabase `users` table
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      // If the user doesn't exist, insert a new row
      if (!existingUser) {
        const { data, error } = await supabase.from("users").insert({
          id,
          emailAddress: emailAddresses[0]?.emailAddress || null,
          firstName: firstName,
          lastName: lastName,
          imageUrl: imageUrl,
        });

        if (error) console.log(error);
        else console.log(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    checkAndCreateUser();
  }, [user]);

  return (
    <div className="h-screen w-4/5 bg-gray-50 flex flex-col relative overflow-scroll">
      {/* Main Content */}
      <div className="p-6">
        <div className="w-full mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <div className="flex items-center space-x-2">
            <AddItemDialog />
            <UserButton />
          </div>
        </div>
        <hr className="mt-6" />
      </div>
      <DashboardBody />
    </div>
  );
}
