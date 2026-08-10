"""AI4Math-Cosmos MVP Backend — FastAPI server with simulated AI mode."""
import asyncio
import json
import os
import random
import time
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ── Config ────────────────────────────────────────────────────────────
SIMULATE_AI = os.environ.get("SIMULATE_AI", "true").lower() == "true"
DATA_PATH = Path(__file__).parent / "data" / "stars.json"

app = FastAPI(title="AI4Math-Cosmos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory state ───────────────────────────────────────────────────
nodes_data: dict = {}
node_map: dict = {}
edges_data: list = []
active_tasks: dict = {}  # task_id -> {"node_id": ..., "status": ...}


def load_data():
    global nodes_data, node_map, edges_data
    with open(DATA_PATH) as f:
        data = json.load(f)
    nodes_data = data
    edges_data = data["edges"]
    node_map = {n["id"]: n for n in data["nodes"]}


load_data()


# ── REST API ──────────────────────────────────────────────────────────

@app.get("/api/cosmos/nodes")
async def get_nodes():
    return nodes_data


@app.post("/api/cosmos/solve/{node_id}")
async def solve_node(node_id: str):
    if node_id not in node_map:
        return {"error": "Node not found", "node_id": node_id}

    task_id = f"task-{int(time.time() * 1000)}-{node_id}"
    node = node_map[node_id]

    active_tasks[task_id] = {
        "node_id": node_id,
        "status": "pending",
        "created_at": time.time(),
    }

    return {"task_id": task_id, "node_id": node_id, "simulate": SIMULATE_AI}


@app.get("/api/cosmos/task/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in active_tasks:
        return {"error": "Task not found", "task_id": task_id}
    return active_tasks[task_id]


# ── WebSocket ─────────────────────────────────────────────────────────

@app.websocket("/ws/solve/{node_id}")
async def websocket_solve(ws: WebSocket, node_id: str):
    await ws.accept()

    if node_id not in node_map:
        await ws.send_json({"event": "error", "message": "Node not found"})
        await ws.close()
        return

    node = node_map[node_id]
    if node["status"] == "solved":
        await ws.send_json({"event": "already_solved", "node_id": node_id})
        await ws.close()
        return

    task_id = f"task-{int(time.time() * 1000)}-{node_id}"
    active_tasks[task_id] = {"node_id": node_id, "status": "running"}

    try:
        await ws.send_json({"event": "task_running", "task_id": task_id, "node_id": node_id})

        if SIMULATE_AI:
            # Simulate AI thinking: 2-6 seconds
            delay = random.uniform(2.0, 6.0)
            await asyncio.sleep(delay)

            # 60% success rate for simulation
            success = random.random() < 0.6

            if success:
                node["status"] = "solved"
                active_tasks[task_id]["status"] = "success"
                await ws.send_json({
                    "event": "task_success",
                    "task_id": task_id,
                    "node_id": node_id,
                })
            else:
                active_tasks[task_id]["status"] = "failed"
                await ws.send_json({
                    "event": "task_failed",
                    "task_id": task_id,
                    "node_id": node_id,
                    "message": "AI could not solve this problem in the current attempt.",
                })
        else:
            # TODO: Call real AI4Math inference
            await asyncio.sleep(3)
            active_tasks[task_id]["status"] = "failed"
            await ws.send_json({
                "event": "task_failed",
                "task_id": task_id,
                "node_id": node_id,
                "message": "Real AI mode not yet implemented.",
            })

    except WebSocketDisconnect:
        pass
    finally:
        active_tasks.pop(task_id, None)


# ── Mount frontend static files ───────────────────────────────────────
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
async def root():
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return {"message": "AI4Math-Cosmos API", "docs": "/docs", "simulate_ai": SIMULATE_AI}


if __name__ == "__main__":
    import uvicorn
    load_data()
    print(f"Simulate AI mode: {SIMULATE_AI}")
    uvicorn.run(app, host="0.0.0.0", port=8000)