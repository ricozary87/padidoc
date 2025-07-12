from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.routes.pembelian_routes import pembelian_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pembelian_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "PADIdoc API aktif bro 🔥"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=3000, reload=True)