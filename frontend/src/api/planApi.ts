export async function getPlan(location: string, date: string) {
    const res = await fetch("http://localhost:3000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, date }),
    });
    return res.json();
}