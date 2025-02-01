""" UUID_generator.py """

import os
import time
from typing import Callable, Optional, Union
import uuid


time_ns = time.time_ns

def uuid7(
    ns: Optional[int] = None,
    as_type: Optional[str] = None,
    time_func: Callable[[], int] = time_ns,
    _last=[0, 0, 0, 0],
    _last_as_of=[0, 0, 0, 0],
) -> Union[uuid.UUID, str, int, bytes]:
    if ns is None:
        ns = time_func()
        last = _last
    else:
        last = _last_as_of
        ns = int(ns)  # Fail fast if not an int

    if ns == 0:
        # Special cose for all-zero uuid. Strictly speaking not a UUIDv7.
        t1 = t2 = t3 = t4 = 0
        rand = b"\0" * 6
    else:
        # Treat the first 8 bytes of the uuid as a long (t1) and two ints
        # (t2 and t3) holding 36 bits of whole seconds and 24 bits of
        # fractional seconds.
        # This gives a nominal 60ns resolution, comparable to the
        # timestamp precision in Linux (~200ns) and Windows (100ns ticks).
        sixteen_secs = 16_000_000_000
        t1, rest1 = divmod(ns, sixteen_secs)
        t2, rest2 = divmod(rest1 << 16, sixteen_secs)
        t3, _ = divmod(rest2 << 12, sixteen_secs)
        t3 |= 7 << 12  # Put uuid version in top 4 bits, which are 0 in t3

        # The next two bytes are an int (t4) with two bits for
        # the variant 2 and a 14 bit sequence counter which increments
        # if the time is unchanged.
        if t1 == last[0] and t2 == last[1] and t3 == last[2]:
            # Stop the seq counter wrapping past 0x3FFF.
            # This won't happen in practice, but if it does,
            # uuids after the 16383rd with that same timestamp
            # will not longer be correctly ordered but
            # are still unique due to the 6 random bytes.
            if last[3] < 0x3FFF:
                last[3] += 1
        else:
            last[:] = (t1, t2, t3, 0)
        t4 = (2 << 14) | last[3]  # Put variant 0b10 in top two bits

        # Six random bytes for the lower part of the uuid
        rand = os.urandom(6)

    # Build output
    if as_type == "str":
        return f"{t1:>08x}-{t2:>04x}-{t3:>04x}-{t4:>04x}-{rand.hex()}"

    r = int.from_bytes(rand, "big")
    uuid_int = (t1 << 96) + (t2 << 80) + (t3 << 64) + (t4 << 48) + r
    if as_type == "int":
        return uuid_int
    elif as_type == "hex":
        return f"{uuid_int:>032x}"
    elif as_type == "bytes":
        return uuid_int.to_bytes(16, "big")
    else:
        return uuid.UUID(int=uuid_int)

print(uuid7())