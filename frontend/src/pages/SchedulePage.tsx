import React, { useState } from 'react';

interface ScheduleItem {
  id: number;
  time: string;
  activity: string;
  location: string;
  duration: string;
}

interface Schedule {
  id: number;
  title: string;
  date: string;
  items: ScheduleItem[];
}

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      title: "東京観光 1日目",
      date: "2024-03-15",
      items: [
        {
          id: 1,
          time: "09:00",
          activity: "東京駅到着",
          location: "東京駅",
          duration: "30分"
        },
        {
          id: 2,
          time: "10:00",
          activity: "皇居東御苑見学",
          location: "皇居東御苑",
          duration: "2時間"
        },
        {
          id: 3,
          time: "13:00",
          activity: "銀座でランチ",
          location: "銀座",
          duration: "1時間"
        }
      ]
    }
  ]);
  
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(schedules[0] || null);

  return (
    <div className="page-container">
      <h1>スケジュール</h1>
      <div className="schedule-container">
        <div className="schedule-sidebar">
          <h3>旅行プラン</h3>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`schedule-item ${selectedSchedule?.id === schedule.id ? 'active' : ''}`}
              onClick={() => setSelectedSchedule(schedule)}
            >
              <div className="schedule-title">{schedule.title}</div>
              <div className="schedule-date">{schedule.date}</div>
            </div>
          ))}
          <button className="add-schedule-btn">
            + 新しいスケジュールを作成
          </button>
        </div>
        
        <div className="schedule-detail">
          {selectedSchedule ? (
            <>
              <h2>{selectedSchedule.title}</h2>
              <p className="schedule-date">{selectedSchedule.date}</p>
              <div className="timeline">
                {selectedSchedule.items.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-content">
                      <h4>{item.activity}</h4>
                      <p className="location">{item.location}</p>
                      <p className="duration">所要時間: {item.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-schedule">
              スケジュールを選択してください
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;