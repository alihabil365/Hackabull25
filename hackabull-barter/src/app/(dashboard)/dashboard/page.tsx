import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase, Item, Match } from "@/lib/supabase";

async function getUserItems(userId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user items:", error);
    return [];
  }

  return data || [];
}

async function getUserMatches(userId: string): Promise<Match[]> {
  const { data: userItems } = await supabase
    .from("items")
    .select("id")
    .eq("user_id", userId);

  if (!userItems || userItems.length === 0) {
    return [];
  }

  const userItemIds = userItems.map((item) => item.id);

  const { data: matches, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      item_a:item_a_id(*),
      item_b:item_b_id(*)
    `
    )
    .or(
      `item_a_id.in.(${userItemIds.join(",")}),item_b_id.in.(${userItemIds.join(
        ","
      )})`
    )
    .order("matched_at", { ascending: false });

  if (error) {
    console.error("Error fetching user matches:", error);
    return [];
  }

  return matches || [];
}

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [items, matches] = await Promise.all([
    getUserItems(userId),
    getUserMatches(userId),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      {/* User's Items Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Items</h2>
          <Link href="/upload-item" className="btn-primary">
            Add New Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card p-8 text-center">
            <h3 className="text-xl mb-4">You don&apos;t have any items yet</h3>
            <p className="text-gray-600 mb-6">
              Add items you want to trade to get started.
            </p>
            <Link href="/upload-item" className="btn-primary inline-block">
              Upload Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Est. Value: ${item.estimated_value.toFixed(2)}
                  </p>
                  <p className="text-sm line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Matches Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Matches</h2>
        {matches.length === 0 ? (
          <div className="card p-8 text-center">
            <h3 className="text-xl mb-4">No matches yet</h3>
            <p className="text-gray-600 mb-6">
              Start swiping to find potential trades!
            </p>
            <Link href="/trade" className="btn-primary inline-block">
              Find Trades
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="card p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {match.item_a?.user_id === userId
                        ? match.item_b?.title
                        : match.item_a?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Match status:{" "}
                      <span className="capitalize">{match.status}</span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {match.status === "pending" && (
                      <div className="flex space-x-2">
                        <button className="btn-primary py-1 px-3 text-sm">
                          Accept
                        </button>
                        <button className="btn-outline py-1 px-3 text-sm">
                          Decline
                        </button>
                      </div>
                    )}
                    {match.status === "accepted" && (
                      <button className="btn-secondary py-1 px-3 text-sm">
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
