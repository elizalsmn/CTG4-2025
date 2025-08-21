# utils/properties.py
from pathlib import Path
from typing import Dict

def load_properties(path: str | Path) -> Dict[str, str]:
    """Simple .properties file reader into dict[str,str]."""
    props = {}
    path = Path(path)
    if not path.exists():
        return props
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith(";"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        props[key.strip()] = value.strip()
    return props

def get_mongo_uri(props: Dict[str, str]) -> str:
    """Return full Mongo URI from db.uri or build from parts."""
    if "db.uri" in props:
        return props["db.uri"]
    host = props.get("db.host", "localhost")
    port = props.get("db.port", "27017")
    name = props.get("db.name", "mydb")
    user = props.get("db.user")
    pwd = props.get("db.password")
    if user and pwd:
        return f"mongodb://{user}:{pwd}@{host}:{port}/{name}?authSource={name}"
    return f"mongodb://{host}:{port}/{name}"
