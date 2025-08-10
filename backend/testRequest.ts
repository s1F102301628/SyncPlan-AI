async function testPlan() {
    const res = await fetch('http://localhost:3000/api/plan', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            location: "大阪",
            date: "0205-08-10"
        })
    });

    const data = await res.json();
    console.log(data);

}

testPlan();