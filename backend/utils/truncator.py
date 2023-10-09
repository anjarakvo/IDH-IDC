from sqlalchemy.orm import Session
from sqlalchemy.sql import text


def truncatedb(session: Session, table: str) -> None:
    session.execute(text(f"TRUNCATE TABLE {table} CASCADE;"))
    session.execute(text(f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1;"))
    session.execute(text(f"UPDATE {table} SET id=nextval('{table}_id_seq');"))
    session.commit()
    session.flush()
    return f"{table} Truncated"
