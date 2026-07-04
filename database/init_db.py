from database.postgres import engine
from database.models import Base


def init_database():

    Base.metadata.create_all(bind=engine)

    print("=" * 80)
    print("PostgreSQL Ready")
    print("=" * 80)


if __name__ == "__main__":
    init_database()
