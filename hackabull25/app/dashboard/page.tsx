"use client";

// React
import { useEffect } from "react";

// Clerk
import { useUser } from "@clerk/nextjs";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Components
import DashboardSidebar from "./components/DashboardSidebar";
import AddItemDialog from "./components/AddItemDialog";

function Page() {
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
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl,
        });

        if (error) console.log(error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    checkAndCreateUser();
  }, [user]);

  return (
    <div className="h-screen w-full flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Area */}
      <div className="w-3/4 h-full">
        {/* Top bar */}
        <div className="p-6 flex justify-end">
          <AddItemDialog />
        </div>
      </div>
    </div>
  );
}

export default Page;
