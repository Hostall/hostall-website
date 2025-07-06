
// ✅ LIVE Supabase Data Fetch Script (No Caching)

const SUPABASE_URL = "https://pjnqhdhlcgrrmfzscswv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbnFoZGhsY2dycm1menNjc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg3NDMsImV4cCI6MjA2NjUzNDc0M30.UVaJXabJDPMSHgDzUk3tOEv9sAFSjqSRNEYroypqyGs";

const supabase = window.supabase || (typeof createClient !== "undefined" && createClient(SUPABASE_URL, SUPABASE_KEY));

// Force live fetch on page load (no caching)
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔁 Fetching latest hostel data from Supabase...");
  fetchHostels();
});

async function fetchHostels() {
  try {
    const { data, error } = await supabase
      .from("hostels")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching hostels:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No hostel data found.");
      return;
    }

    console.log("🏠 Hostels loaded:", data.length);
    renderHostels(data);
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

// Example render function placeholder
function renderHostels(hostels) {
  const container = document.getElementById("hostel-list");
  if (!container) return;

  container.innerHTML = ""; // Clear previous data
  hostels.forEach(h => {
    const card = document.createElement("div");
    card.className = "card mb-4";
    card.innerHTML = `
      <h2 class="text-xl font-bold">${h.name}</h2>
      <p class="text-sm text-gray-700">${h.location}</p>
      <p class="text-sm text-gray-500">${h.room_type} - Rs ${h.rent}</p>
    `;
    container.appendChild(card);
  });
}
