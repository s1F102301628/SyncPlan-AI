import { useState } from "react";
import { getPlan } from "../api/planApi";

export default function Schadule() {
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [plan, setPlan] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getPlan(location, date);
    setPlan(data.plan);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="場所"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">プラン生成</button>
      </form>

      {plan && (
        <div>
          <h2>{plan.location}の予定</h2>
          {plan.activities.map((a: any, i: number) => (
            <div key={i}>
              <strong>{a.time}</strong> - {a.activity}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}