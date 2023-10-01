import os
from jsmin import jsmin
from fastapi import FastAPI, Request, Response
from middleware import decode_token
from fastapi.responses import FileResponse

from routes.user import user_route


app = FastAPI(
    root_path="/api",
    title="IDH-IDC",
    description="Auth Client ID: 99w2F1wVLZq8GqJwZph1kE42GuAZFvlF",
    version="1.0.0",
    contact={
        "name": "Akvo",
        "url": "https://akvo.org",
        "email": "dev@akvo.org",
    },
    license_info={
        "name": "AGPL3",
        "url": "https://www.gnu.org/licenses/agpl-3.0.en.html",
    },
)

JS_FILE = "./config.min.js"


# Routes register
app.include_router(user_route)


@app.get("/", tags=["Dev"])
def read_main():
    return "OK"


@app.get("/health-check", tags=["Dev"])
def health_check():
    return "OK"


@app.get(
    "/config.js",
    response_class=FileResponse,
    tags=["Config"],
    name="config.js",
    description="static javascript config")
async def main(res: Response):
    # if not os.path.exists(JS_FILE):
    env_js = "var __ENV__={"
    env_js += "client_id:\"{}\"".format(os.environ["CLIENT_ID"])
    env_js += ", client_secret:\"{}\"".format(os.environ["CLIENT_SECRET"])
    env_js += "};"
    min_js = jsmin("".join([
        env_js,
        ";"
    ]))
    open(JS_FILE, 'w').write(min_js)
    res.headers["Content-Type"] = "application/x-javascript; charset=utf-8"
    return JS_FILE


@app.middleware("http")
async def route_middleware(request: Request, call_next):
    auth = request.headers.get('Authorization')
    if auth:
        auth = decode_token(auth.replace("Bearer ", ""))
        request.state.authenticated = auth
    response = await call_next(request)
    return response
