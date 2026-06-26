from workflow import run

results = run()

for item in results:

    print("=" * 60)

    print(item["job"]["title"])
    print(item["job"]["company"])

    print()

    print(item["analysis"])

    print()

    print(item["resume"])
