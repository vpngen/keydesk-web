#!/usr/bin/env python3
"""Offline stand-in for a brigade keydesk, enough for the regular layout.

Serves the handful of endpoints the free/VIP cabinet calls and issues an
unsigned-looking JWT whose claims the frontend decodes client side. Used to
look at partner skins locally without a stage keydesk:

    python3 dev/mock-keydesk.py --country kg        # 127.0.0.1:8090
    npx vite --mode mock                             # reads .env.mock.local

Adding and deleting keys answer 501 on purpose, which doubles as a check of the
themed error dialog.
"""
import argparse
import base64
import json
import time
import uuid
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

NOW = datetime.now(timezone.utc)


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def make_token(country: str, vip: bool, pro: bool = False) -> str:
    header = {"alg": "ES256", "typ": "JWT", "kid": "mock"}
    now = int(time.time())
    payload = {
        "iss": "mock-keydesk",
        "sub": "0b131356-0000-4000-8000-000000000000",
        "aud": ["keydesk"],
        "exp": now + 3600,
        "nbf": now - 60,
        "iat": now - 60,
        "jti": str(uuid.uuid4()),
        "external_ip": "127.0.0.1",
        "vip": vip,
        "pro": pro,
    }
    if vip:
        payload["vip_url"] = f"http://127.0.0.1:{Handler.port}/vip"
    payload["country"] = country or "ru"
    return ".".join([
        b64url(json.dumps(header).encode()),
        b64url(json.dumps(payload).encode()),
        b64url(b"mock-signature"),
    ])


def user(name, status, hours_ago, person, desc, link, quota=100.0):
    return {
        "UserID": str(uuid.uuid5(uuid.NAMESPACE_URL, name)),
        "UserName": name,
        "Status": status,
        "CreatedAt": (NOW - timedelta(days=90)).isoformat(),
        "LastVisitHour": (NOW - timedelta(hours=hours_ago)).isoformat() if hours_ago is not None else None,
        "MonthlyQuotaRemainingGB": quota,
        "PersonName": person,
        "PersonDesc": desc,
        "PersonDescLink": link,
    }


WIKI = "https://ru.wikipedia.org/wiki/"
USERS = [
    user("тест # 1234", "green", 1, "Чингиз Айтматов", "Писатель.", WIKI + "Айтматов,_Чингиз_Торекулович"),
    user("Хитрый Илбирс", "green", 3, "Снежный барс", "Илбирс - снежный барс.", WIKI + "Ирбис"),
    user("Быстрый Кулан", "green", 26, "Кулан", "Дикий осёл.", WIKI + "Кулан"),
    user("Тихий Беркут", "yellow", 50, "Беркут", "Орёл.", WIKI + "Беркут"),
    user("Смелый Архар", "grey", 800, "Архар", "Горный баран.", WIKI + "Архар"),
    user("Мудрый Улар", "black", None, "Улар", "Горная индейка.", WIKI + "Улары"),
    user("Ловкий Сурок", "red", 5, "Сурок", "Сурок Мензбира.", WIKI + "Сурок_Мензбира", quota=0.0),
    user("Зоркий Сапсан", "green", 12, "Сапсан", "Сокол.", WIKI + "Сапсан"),
    user("Добрый Марал", "green", 7, "Марал", "Благородный олень.", WIKI + "Марал"),
    user("Шустрый Козерог", "yellow", 30, "Козерог", "Сибирский горный козёл.", WIKI + "Сибирский_горный_козёл"),
]


def stats():
    active = [3, 4, 4, 6, 7, 9, 9, 10, 11, 12, 12, 8]
    total = [4, 5, 6, 7, 8, 10, 10, 11, 12, 12, 13, 13]
    traffic = [120.5, 150.2, 180.0, 210.4, 260.1, 320.9, 380.0, 420.3, 470.2, 510.8, 542.0, 160.3]
    month = (NOW.month % 12)  # chart expects 12 months ending with the current one
    months = [((month + i) % 12) + 1 for i in range(1, 13)]
    return {
        "ActiveUsers": [{"Month": m, "Value": v} for m, v in zip(months, active)],
        "TotalUsers": [{"Month": m, "Value": v} for m, v in zip(months, total)],
        "TotalTrafficGB": [{"Month": m, "Value": v} for m, v in zip(months, traffic)],
        "FreeSlots": 240,
        "TotalSlots": 250,
    }


class Handler(BaseHTTPRequestHandler):
    country = "ru"
    vip = False
    pro = False
    port = 8090

    def _cors(self):
        origin = self.headers.get("Origin", "*")
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Vary", "Origin")

    def _json(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/user":
            return self._json(200, USERS)
        if path == "/users/stats":
            return self._json(200, stats())
        if path == "/messages":
            return self._json(200, {"messages": [], "total": 0})
        return self._json(404, {"message": f"mock: no route for GET {path}"})

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path == "/token":
            return self._json(201, {"Token": make_token(self.country, self.vip, self.pro)})
        if path == "/vip":
            return self._json(200, {"data": [{"user_id": "vip-demo-1", "good_content": "http://127.0.0.1:8090/vgc://demo-vip-key"}]})
        if path.startswith("/messages/") and path.endswith("/read"):
            return self._json(200, {})
        if path == "/user":
            return self._json(501, {"message": "mock: adding keys is not supported"})
        return self._json(404, {"message": f"mock: no route for POST {path}"})

    def do_DELETE(self):
        return self._json(501, {"message": "mock: deleting keys is not supported"})

    def log_message(self, fmt, *args):
        print(f"{self.command} {self.path} -> {args[1] if len(args) > 1 else ''}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--country", default="ru", help="value of the `country` claim: ru (default look) or kg")
    parser.add_argument("--vip", action="store_true", help="issue a VIP token")
    parser.add_argument("--pro", action="store_true", help="issue a PRO token (country must still win)")
    parser.add_argument("--port", type=int, default=8090)
    args = parser.parse_args()

    Handler.country = args.country
    Handler.vip = args.vip
    Handler.pro = args.pro
    Handler.port = args.port
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"mock keydesk on http://127.0.0.1:{args.port} country={args.country!r} vip={args.vip}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
