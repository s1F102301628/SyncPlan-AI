from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn

app = FastAPI(title="Saitama Events API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   
        "http://localhost:5174", 
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Saitama Events API ready"}

@app.get("/events")
def get_events(nation: str = "日本", keyword: str = "", limit: int = 20):
    events = []
    
    # 1. connpass（IT/テックイベント全国）
    try:
        cp_url = f"https://connpass.com/api/v1.2/event/?keyword={keyword}&count={limit}"
        cp_res = requests.get(cp_url)
        if cp_res.status_code == 200:
            cp_events = cp_res.json()['events'] or []
            events.extend([{
                'title': e['title'],
                'description': e['catch'],
                'location': e['place'],
                'date': e['updated_at'],
                'category': 'テックイベント'
            } for e in cp_events[:10]])
    except: pass
    
    # 2. ダミー祭り（地方創生テーマ）
    dummy_festivals = [
        {"title": "東京花火大会", "description": "隅田川花火", "location": "東京都", "date": "2026-07-26", "category": "祭り"},
        {"title": "京都祇園祭", "description": "山鉾巡行", "location": "京都府", "date": "2026-07-17", "category": "伝統"},
        {"title": "川口納涼花火", "description": "地元夏祭り", "location": "埼玉県川口市", "date": "2026-08-01", "category": "地域"},
        {"title": "大阪天神祭", "description": "日本三大祭", "location": "大阪府", "date": "2026-07-25", "category": "祭り"}
    ]
    events.extend(dummy_festivals[:5])
    
    return events[:limit]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
