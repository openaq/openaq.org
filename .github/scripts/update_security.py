from datetime import datetime
import re

with open("themes/openaq/static/.well-known/security.txt", "r+") as f:
    data = f.read()
    dt = datetime.now()
    if dt.month == 1:
        new_date = datetime(
            year=dt.year, month=7, day=31, hour=11, minute=59, second=59
        )
    if dt.month == 7:
        new_date = datetime(
            year=dt.year + 1, month=1, day=31, hour=11, minute=59, second=59
        )
    expire_line = f"Expires: {new_date.isoformat()}Z\n"
    new_data = re.sub(
        r"Expires\:\s\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}Z\n", expire_line, data
    )
    f.seek(0)
    f.write(new_data)
