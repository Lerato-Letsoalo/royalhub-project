"""RoyalHub prototype backend. Run: python server.py (then visit http://localhost:8000)."""
import json
import sqlite3
import sys
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DB = ROOT / "royalhub.db"

def connect():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    with connect() as con:
        con.executescript("""
          CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, full_name TEXT, email TEXT, phone TEXT, address TEXT);
          CREATE TABLE IF NOT EXISTS claims (id TEXT PRIMARY KEY, insurer TEXT, type TEXT, status TEXT, created_at TEXT, location TEXT, evidence_count INTEGER DEFAULT 0);
          CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, type TEXT, status TEXT, note TEXT, created_at TEXT);
          CREATE TABLE IF NOT EXISTS providers (name TEXT PRIMARY KEY, status TEXT, last_synced TEXT, error TEXT);
          CREATE TABLE IF NOT EXISTS compliance (id INTEGER PRIMARY KEY, category TEXT, count INTEGER, severity TEXT, detail TEXT);
        """)
        if not con.execute("SELECT 1 FROM profiles").fetchone():
            con.execute("INSERT INTO profiles VALUES (?,?,?,?,?)", ("RSF-1048", "Lerato Letsoalo", "lerato.demo@example.co.za", "071 000 0000", "12 Jacaranda Close, Sandton, Johannesburg, 2196"))
            con.executemany("INSERT INTO providers VALUES (?,?,?,?)", [("Santam","Connected","2 minutes ago",None),("Sanlam","Connected","5 minutes ago",None),("Discovery","Syncing","Syncing now",None),("Old Mutual","Connected","1 hour ago",None),("Momentum","Needs attention","3 days ago","Token refresh failed"),("Liberty","Connected","18 minutes ago",None)])
            con.executemany("INSERT INTO compliance(category,count,severity,detail) VALUES (?,?,?,?)", [("Identity verification",4,"overdue","Client identity verification overdue"),("Policy schedules",7,"attention","Expiring within 30 days"),("Asset valuations",5,"attention","Awaiting client upload")])
            con.execute("INSERT INTO claims VALUES (?,?,?,?,?,?,?)", ("RSF-2048","Sanlam","Motor","In progress","2026-09-03T10:14:00+00:00","Johannesburg",2))

def rows(query, params=()):
    with connect() as con: return [dict(r) for r in con.execute(query, params)]

def one(query, params=()):
    result = rows(query, params)
    return result[0] if result else None

class RoyalHubHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs): super().__init__(*args, directory=str(ROOT), **kwargs)
    def json(self, payload, status=200):
        body = json.dumps(payload).encode()
        self.send_response(status); self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
    def body(self):
        length = int(self.headers.get("Content-Length", 0)); return json.loads(self.rfile.read(length) or b"{}")
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health": return self.json({"status":"ok", "time":datetime.now(timezone.utc).isoformat()})
        if path == "/api/bootstrap":
            return self.json({"profile": one("SELECT * FROM profiles WHERE id='RSF-1048'"), "claims":rows("SELECT * FROM claims ORDER BY created_at DESC"), "providers":rows("SELECT name, status, last_synced AS lastSynced, error FROM providers"), "compliance":rows("SELECT category, count, severity, detail FROM compliance"), "admin":{"activeClients":248,"advisers":8,"aua":1280000000,"monthlyPremiums":8600000,"investmentContributions":14200000}})
        if path == "/api/claims": return self.json(rows("SELECT * FROM claims ORDER BY created_at DESC"))
        if path == "/api/requests": return self.json(rows("SELECT * FROM requests ORDER BY created_at DESC"))
        if path == "/api/providers": return self.json(rows("SELECT name, status, last_synced AS lastSynced, error FROM providers"))
        if path == "/api/compliance": return self.json(rows("SELECT category, count, severity, detail FROM compliance"))
        if path == "/api/profile/RSF-1048": return self.json(one("SELECT * FROM profiles WHERE id='RSF-1048'"))
        return super().do_GET()
    def do_POST(self):
        path, data = urlparse(self.path).path, self.body()
        now = datetime.now(timezone.utc).isoformat()
        if path == "/api/claims":
            claim_id = "RSF-" + str(2050 + len(rows("SELECT id FROM claims")))
            record = (claim_id, data.get("insurer","Sanlam"), data.get("type","Motor"), "Submitted", now, data.get("location","Live location captured"), int(data.get("evidenceCount",0)))
            with connect() as con: con.execute("INSERT INTO claims VALUES (?,?,?,?,?,?,?)", record)
            return self.json(dict(zip(["id","insurer","type","status","created_at","location","evidence_count"],record)), HTTPStatus.CREATED)
        if path == "/api/requests":
            request_id = "RSF-" + str(1054 + len(rows("SELECT id FROM requests")))
            record = (request_id, data.get("type","Document request"), "Processing", data.get("note",""), now)
            with connect() as con: con.execute("INSERT INTO requests VALUES (?,?,?,?,?)", record)
            return self.json(dict(zip(["id","type","status","note","created_at"],record)), HTTPStatus.CREATED)
        return self.json({"error":"Not found"}, 404)
    def do_PATCH(self):
        if urlparse(self.path).path != "/api/profile/RSF-1048": return self.json({"error":"Not found"}, 404)
        data = self.body(); allowed = {k:data[k] for k in ("full_name","email","phone","address") if k in data}
        if not allowed: return self.json({"error":"No changes supplied"}, 400)
        assignments = ", ".join(f"{k}=?" for k in allowed)
        with connect() as con: con.execute(f"UPDATE profiles SET {assignments} WHERE id=?", (*allowed.values(), "RSF-1048"))
        return self.json(one("SELECT * FROM profiles WHERE id='RSF-1048'"))

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    init_db(); print(f"RoyalHub running at http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), RoyalHubHandler).serve_forever()
