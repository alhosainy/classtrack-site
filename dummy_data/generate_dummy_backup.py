#!/usr/bin/env python3
"""Generate a full ClassTrack dummy dataset as a restorable backup.

Produces `classtrack.db` (SQLite, schema v13) and wraps it as
`classtrack_backup_<date>.zip` — the exact format DataBackupService.restoreBackup
accepts. Restoring REPLACES all current data (intended: it's a demo dataset).

Usage:  python generate_dummy_backup.py
Output: ./classtrack_dummy.db
        ./classtrack_backup_<yyyy-MM-dd>.zip
"""

import json
import sqlite3
import zipfile
from datetime import date, datetime, timedelta, timezone

OWNER = "offline-user"  # offline sentinel; every row stays local-only
SYNC_NOW = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

DDL = """
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  parent_phone TEXT,
  qr_token TEXT UNIQUE,
  notes TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  subject TEXT,
  fee_per_student REAL DEFAULT 0,
  fee_per_student_cents INTEGER NOT NULL DEFAULT 0,
  type TEXT DEFAULT 'center',
  sort_order INTEGER DEFAULT 0,
  billing_mode TEXT NOT NULL DEFAULT 'monthly',
  fee_per_session REAL NOT NULL DEFAULT 0,
  fee_per_session_cents INTEGER NOT NULL DEFAULT 0,
  whatsapp_group TEXT NOT NULL DEFAULT '',
  is_archived INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE schedule_rows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  weekday INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  UNIQUE (group_id, weekday, start_time),
  FOREIGN KEY (group_id) REFERENCES groups (id)
);
CREATE INDEX IF NOT EXISTS ix_schedule_rows_group ON schedule_rows (group_id);
CREATE TABLE student_group (
  student_id INTEGER,
  group_id INTEGER,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (student_id, group_id),
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (group_id) REFERENCES groups (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_student_group_one_member
  ON student_group (student_id);
CREATE INDEX IF NOT EXISTS ix_student_group_group ON student_group (group_id);
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'absent',
  homework TEXT NOT NULL DEFAULT 'not_done',
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  UNIQUE (student_id, date, group_id),
  FOREIGN KEY (group_id) REFERENCES groups (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);
CREATE INDEX IF NOT EXISTS ix_attendance_group_date ON attendance (group_id, date);
CREATE TABLE test_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  date TEXT,
  max_score INTEGER NOT NULL DEFAULT 20,
  sort_order INTEGER NOT NULL DEFAULT 0,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (group_id) REFERENCES groups (id)
);
CREATE TABLE tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  test_definition_id INTEGER NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  UNIQUE (student_id, test_definition_id),
  FOREIGN KEY (group_id) REFERENCES groups (id),
  FOREIGN KEY (student_id) REFERENCES students (id),
  FOREIGN KEY (test_definition_id) REFERENCES test_definitions (id) ON DELETE CASCADE
);
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  amount REAL NOT NULL DEFAULT 0,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  date TEXT,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  UNIQUE (student_id, month, group_id),
  FOREIGN KEY (group_id) REFERENCES groups (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);
CREATE TABLE session_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  session_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  amount REAL NOT NULL DEFAULT 0,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  date TEXT,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  UNIQUE (student_id, session_date, group_id),
  FOREIGN KEY (group_id) REFERENCES groups (id),
  FOREIGN KEY (student_id) REFERENCES students (id)
);
CREATE TABLE group_report_templates (
  group_id INTEGER PRIMARY KEY,
  daily_title TEXT NOT NULL DEFAULT '',
  daily_greeting TEXT NOT NULL DEFAULT '',
  daily_intro TEXT NOT NULL DEFAULT '',
  daily_message TEXT NOT NULL DEFAULT '',
  daily_sign_off TEXT NOT NULL DEFAULT '',
  grades_title TEXT NOT NULL DEFAULT '',
  grades_greeting TEXT NOT NULL DEFAULT '',
  grades_intro TEXT NOT NULL DEFAULT '',
  grades_message TEXT NOT NULL DEFAULT '',
  grades_sign_off TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
);
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  moved_to_date TEXT,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1,
  UNIQUE (group_id, date),
  FOREIGN KEY (group_id) REFERENCES groups (id)
);
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  subjects TEXT NOT NULL DEFAULT '[]',
  photo_url TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'teacher',
  updated_at TEXT NOT NULL DEFAULT '',
  deleted_at TEXT,
  dirty INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE sync_tombstones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_key_json TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'offline-user',
  deleted_at TEXT NOT NULL DEFAULT '',
  dirty INTEGER NOT NULL DEFAULT 1
);
"""


def qr_token(i: int) -> str:
    return f"qr-{i:04d}-a1b2c3d4e5f60718"


def stamp() -> dict:
    return {
        "user_id": OWNER,
        "updated_at": SYNC_NOW,
        "deleted_at": None,
        "dirty": 1,
    }


def main() -> None:
    import glob
    import os
    for stale in glob.glob("classtrack_dummy.db") + \
            glob.glob("classtrack_backup_*.zip"):
        os.remove(stale)

    conn = sqlite3.connect("classtrack_dummy.db")
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.executescript(DDL)
    conn.execute("PRAGMA user_version = 13;")
    cur = conn.cursor()

    # ---------------- Groups + schedules ----------------
    # g1 gegth monthly, g2 gph monthly, g3 online per-session
    groups = [
        # id name subject type billing fee_monthly fee_session sort
        (1, "مجموعة الرياضيات", "الرياضيات", "center", "monthly", 40000, 0, 0),
        (2, "مجموعة الفيزياء", "الفيزياء", "center", "monthly", 50000, 0, 1),
        (3, "مجموعة الإنجليزي", "إنجليزي", "online", "per_session", 0, 10000, 2),
    ]
    for gid, name, subject, gtype, billing, fee_m, fee_s, order in groups:
        cur.execute(
            """INSERT INTO groups (id, name, user_id, subject, fee_per_student,
               fee_per_student_cents, type, sort_order, billing_mode,
               fee_per_session, fee_per_session_cents, whatsapp_group,
               is_archived, updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                gid, name, OWNER, subject,
                fee_m / 100 if fee_m else 0, fee_m,
                gtype, order, billing,
                fee_s / 100 if fee_s else 0, fee_s,
                f"{name} واتساب", 0,
                SYNC_NOW, None, 1,
            ),
        )

    # schedule_rows: (id, gid, weekday Mon=1..Sun=7, start, end, sort)
    rows = [
        (1, 1, 1, "17:00", "18:30", 0),   # g1 Mon
        (2, 1, 3, "17:00", "18:30", 1),   # g1 Wed
        (3, 2, 2, "18:30", "20:00", 0),   # g2 Tue
        (4, 2, 4, "18:30", "20:00", 1),   # g2 Thu
        (5, 3, 6, "10:00", "11:00", 0),   # g3 Sat
    ]
    for rid, gid, wd, st, et, order in rows:
        cur.execute(
            """INSERT INTO schedule_rows (id, group_id, weekday, start_time,
               end_time, sort_order, user_id, updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (rid, gid, wd, st, et, order, OWNER, SYNC_NOW, None, 1),
        )

    # ---------------- Students + memberships ----------------
    students = [
        # id name phone
        (1, "عمر خالد", "0100 123 4561"),
        (2, "علي حسن", "0100 123 4562"),
        (3, "مريم إبراهيم", "0100 123 4563"),
        (4, "يوسف سامي", "0100 123 4564"),
        (5, "جنى أحمد", "0100 123 4565"),
        (6, "فارس محمد", "0100 123 4566"),
        (7, "ليلى عمرو", "0100 123 4567"),
        (8, "كريم عادل", "0100 123 4568"),
        (9, "نور وليد", "0100 123 4569"),
        (10, "حبيبة مصطفى", "0100 123 4570"),
        (11, "آدم شريف", "0100 123 4571"),
        (12, "ريم طارق", "0100 123 4572"),
    ]
    for sid, name, phone in students:
        cur.execute(
            """INSERT INTO students (id, name, parent_phone, qr_token, notes,
               is_archived, user_id, updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (sid, name, phone, qr_token(sid), "", 0, OWNER, SYNC_NOW, None, 1),
        )
    # memberships: group per student
    membership = [(1, 1), (2, 1), (3, 1), (4, 1),
                  (5, 2), (6, 2), (7, 2), (8, 2),
                  (9, 3), (10, 3), (11, 3), (12, 3)]
    for sid, gid in membership:
        cur.execute(
            """INSERT INTO student_group (student_id, group_id, user_id,
               updated_at, deleted_at, dirty) VALUES (?,?,?,?,?,?)""",
            (sid, gid, OWNER, SYNC_NOW, None, 1),
        )

    # ---------------- Session calendar: held sessions in Sept 2026 ----------------
    # Sep 2026: 1=Mon? Sep 13 2026 is Sunday => Sep 7=Mon, Sep 8=Tue...
    # g1 Mon/Wed:   2026-09-02 (Wed), 2026-09-07 (Mon), 2026-09-09 (Wed)
    # g2 Tue/Thu:   2026-09-01 (Tue), 2026-09-03 (Thu canceled), 2026-09-08 (Tue), 2026-09-10 (Thu)
    # g3 Sat:       2026-09-05 (Sat), 2026-09-12 (Sat)
    sessions = [
        (1, 1, "2026-09-02", "held"),
        (2, 1, "2026-09-07", "held"),
        (3, 1, "2026-09-09", "held"),
        (4, 2, "2026-09-01", "held"),
        (5, 2, "2026-09-03", "cancelled"),
        (6, 2, "2026-09-08", "held"),
        (7, 2, "2026-09-10", "held"),
        (8, 3, "2026-09-05", "held"),
        (9, 3, "2026-09-12", "held"),
    ]
    for sid, gid, d, status in sessions:
        cur.execute(
            """INSERT INTO sessions (id, group_id, date, status, moved_to_date,
               user_id, updated_at, deleted_at, dirty) VALUES (?,?,?,?,?,?,?,?,?)""",
            (sid, gid, d, status, None, OWNER, SYNC_NOW, None, 1),
        )

    # ---------------- Attendance (deterministic-ish variety) ----------------
    # statuses used: present (p), late (l), absent (-)
    plan = [
        # (group, date, [statuses per student in membership order])
        (1, "2026-09-02", ["p", "p", "l", "p"]),
        (1, "2026-09-07", ["p", "p", "p", "l"]),
        (1, "2026-09-09", ["p", "l", "p", "-"]),
        (2, "2026-09-01", ["p", "p", "p", "l"]),
        (2, "2026-09-08", ["p", "l", "p", "p"]),
        (2, "2026-09-10", ["l", "p", "p", "p"]),
        (3, "2026-09-05", ["p", "p", "l", "p"]),
        (3, "2026-09-12", ["p", "l", "p", "p"]),
    ]
    hw_by_status = {"p": "complete", "l": "incomplete", "-": "weak"}
    att_id = 1
    for gid, d, statuses in plan:
        gstudents = [sid for sid, g in membership if g == gid]
        for sid, st in zip(gstudents, statuses):
            cur.execute(
                """INSERT INTO attendance (id, group_id, student_id, date, status,
                   homework, user_id, updated_at, deleted_at, dirty)
                   VALUES (?,?,?,?,?,?,?,?,?,?)""",
                (att_id, gid, sid, d, st, hw_by_status[st], OWNER, SYNC_NOW, None, 1),
            )
            att_id += 1

    # ---------------- Tests ----------------
    test_defs = [
        (1, 1, "اختبار الأسبوع ١", "2026-09-08", 20, 0),
        (2, 1, "اختبار الوحدة الأولى", "2026-09-12", 20, 1),
        (3, 2, "اختبار الأسبوع ١", "2026-09-05", 20, 0),
        (4, 2, "اختبار الوحدة الأولى", "2026-09-12", 20, 1),
        (5, 3, "اختبار الكلمات", "2026-09-06", 10, 0),
        (6, 3, "اختبار التعبير", "2026-09-13", 10, 1),
    ]
    for tid, gid, name, d, mx, order in test_defs:
        cur.execute(
            """INSERT INTO test_definitions (id, group_id, name, date, max_score,
               sort_order, user_id, updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (tid, gid, name, d, mx, order, OWNER, SYNC_NOW, None, 1),
        )

    scores = {
        # (student_id, test_def) -> score
        (1, 1): 19, (2, 1): 17, (3, 1): 15, (4, 1): 18,
        (1, 2): 20, (2, 2): 16, (3, 2): 14, (4, 2): 18,
        (5, 3): 18, (6, 3): 16, (7, 3): 20, (8, 3): 15,
        (5, 4): 17, (6, 4): 19, (7, 4): 18, (8, 4): 14,
        (9, 5): 9, (10, 5): 8, (11, 5): 10, (12, 5): 7,
        (9, 6): 8, (10, 6): 9, (11, 6): 7, (12, 6): 6,
    }
    test_id = 1
    for (sid, tid), score in scores.items():
        gid = next(g for _, g in membership if _ == sid)
        cur.execute(
            """INSERT INTO tests (id, group_id, student_id, test_definition_id,
               score, user_id, updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (test_id, gid, sid, tid, score, OWNER, SYNC_NOW, None, 1),
        )
        test_id += 1

    # ---------------- Payments ----------------
    # monthly groups g1 (400) g2 (500): status, amount_cents, payment day
    monthly = [
        (1, 1, "2026-09", "paid", 40000, "2026-09-05"),
        (2, 1, "2026-09", "paid", 40000, "2026-09-05"),
        (3, 1, "2026-09", "partial", 20000, "2026-09-08"),
        (4, 1, "2026-09", "unpaid", 0, None),
        (5, 2, "2026-09", "paid", 50000, "2026-09-04"),
        (6, 2, "2026-09", "paid", 50000, "2026-09-06"),
        (7, 2, "2026-09", "partial", 25000, "2026-09-10"),
        (8, 2, "2026-09", "unpaid", 0, None),
    ]
    for i, (sid, gid, month, status, cents, day) in enumerate(monthly, 1):
        cur.execute(
            """INSERT INTO payments (id, group_id, student_id, month, status,
               amount, amount_cents, date, user_id, updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (i, gid, sid, month, status, cents / 100, cents, day,
             OWNER, SYNC_NOW, None, 1),
        )

    # per-session group g3 (100/session) — Sep 5 + Sep 12
    per_session = [
        # sid, date, status, cents, day
        (9, "2026-09-05", "paid", 10000, "2026-09-05"),
        (9, "2026-09-12", "paid", 10000, "2026-09-12"),
        (10, "2026-09-05", "paid", 10000, "2026-09-05"),
        (10, "2026-09-12", "unpaid", 0, None),
        (11, "2026-09-05", "paid", 10000, "2026-09-06"),
        (11, "2026-09-12", "paid", 10000, "2026-09-12"),
        (12, "2026-09-05", "unpaid", 0, None),
        (12, "2026-09-12", "partial", 5000, "2026-09-13"),
    ]
    for i, (sid, d, status, cents, day) in enumerate(per_session, 100):
        cur.execute(
            """INSERT INTO session_payments (id, group_id, student_id,
               session_date, status, amount, amount_cents, date, user_id,
               updated_at, deleted_at, dirty)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (i, 3, sid, d, status, cents / 100, cents, day,
             OWNER, SYNC_NOW, None, 1),
        )

    # ---------------- Teacher profile ----------------
    cur.execute(
        """INSERT INTO profiles (id, name, subjects, photo_url, role,
           updated_at, deleted_at, dirty) VALUES (?,?,?,?,?,?,?,?)""",
        (OWNER, "أ. أحمد محمود",
         json.dumps(["الرياضيات", "الفيزياء", "الإنجليزي"], ensure_ascii=False),
         "", "teacher", SYNC_NOW, None, 1),
    )

    conn.commit()
    conn.close()

    stamp_date = date.today().isoformat()
    zip_path = f"classtrack_backup_{stamp_date}.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write("classtrack_dummy.db", f"classtrack_backup_{stamp_date}.db")
        zf.writestr("preferences.json", "{}")

    # Quick sanity report
    def count(tbl: str) -> int:
        c = sqlite3.connect("classtrack_dummy.db")
        n = c.execute(f"SELECT COUNT(*) FROM {tbl}").fetchone()[0]
        c.close()
        return n

    print(f"Wrote {zip_path}")
    for tbl in ("groups", "students", "student_group", "schedule_rows",
                "sessions", "attendance", "test_definitions", "tests",
                "payments", "session_payments", "profiles"):
        print(f"  {tbl}: {count(tbl)}")


if __name__ == "__main__":
    main()