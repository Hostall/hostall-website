
// Secure Supabase Sync using Backend Proxy (no keys exposed)
async function fetchHostelData() {
  try {
    const response = await fetch('/api/hostels');  // Connects to secure backend endpoint
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    console.log("Data from secure backend:", data);
    // renderData(data); // Call your render function here
  } catch (error) {
    console.error('Error loading hostel data:', error);
  }
}
fetchHostelData();
