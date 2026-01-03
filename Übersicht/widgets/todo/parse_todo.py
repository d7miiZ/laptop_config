#!/usr/bin/env python3
import sys, os, datetime, json

try:
    from dateutil.parser import parse as parse_date
except ImportError:
    import datetime
    def parse_date(ds):
        return datetime.datetime.strptime(ds, "%Y-%m-%d")

def parse_todo(path):
    todos = []
    section = None
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith("#"):
                section = line.strip("# ").strip()
                continue
            done = line.startswith("x ")
            text = line[2:].strip() if done else line[1:].strip()
            date = None
            if "<" in text and ">" in text:
                start, end = text.find("<"), text.find(">")
                ds = text[start+1:end]
                text = text[:start].strip()
                try:
                    date = parse_date(ds).date().isoformat()
                except Exception:
                    pass
            todos.append({"section": section, "text": text, "done": done, "date": date})
    return todos

if __name__ == "__main__":
    path = sys.argv[1]
    if not os.path.exists(path):
        print(json.dumps({"error": f"File not found: {path}"}))
        sys.exit(1)
    print(json.dumps(parse_todo(path)))

