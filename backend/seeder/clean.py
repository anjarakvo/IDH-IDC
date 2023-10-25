import sys
from db.connection import Base, engine, SessionLocal
from utils.truncator import truncatedb


def clean_db(table: str):
    session = SessionLocal()
    Base.metadata.create_all(bind=engine)
    if table == "case":
        truncatedb(session=session, table="case_commodity")
        truncatedb(session=session, table="case_tag")
        truncatedb(session=session, table="case")
        print("All cases removed")
    elif table == "user":
        truncatedb(session=session, table="user_tag")
        truncatedb(session=session, table="user_bussiness_unit")
        truncatedb(session=session, table="user")
        print("All users removed")
    session.close()


if __name__ == "__main__":
    input = sys.argv
    if len(input) < 2:
        print("Please provide a valid input")
        exit(1)
    if input[1] == "-h":
        # -c remove all cases
        # -u remove all users
        # -h help
        print("Usage:\n-c remove all cases\n-u remove all users\n-h help")
        exit(0)
    if input[1] == "-c":
        clean_db(table="case")
        exit(0)
    if input[1] == "-u":
        clean_db(table="user")
        exit(0)
