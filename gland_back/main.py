import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from ruteri.login_ruter import router as login_router
from ruteri.korisnik_ruter import router as korisnik_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router)
app.include_router(korisnik_router)

if __name__ == '__main__':
    print("usao")
    uvicorn.run('main:app',
                host="0.0.0.0",
                port=9000,
                reload=True,
                access_log=False,
                # ssl_keyfile="/etc/letsencrypt/live/kupistan.me/privkey.pem",
                # ssl_certfile="/etc/letsencrypt/live/kupistan.me/fullchain.pem",
                reload_dirs=[]
                )
