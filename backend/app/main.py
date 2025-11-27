from fastapi import FastAPI

app = FastAPI(title="AI Teaching Assistant Backend")


@app.get("/")
def root():
    return {"status": "ok", "service": "ai-teaching-assistant", "version": "0.1.0"}


@app.get("/healthz")
def healthz():
    return {"ok": True}


