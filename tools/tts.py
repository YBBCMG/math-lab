# -*- coding: utf-8 -*-
"""批量合成配音：读 tools/narration.json → media/<lesson>/<mi>-<si>.mp3
用法：python tools/tts.py [--force]
"""
import asyncio, json, os, sys
import edge_tts

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "+8%"
CONC = 3
FORCE = "--force" in sys.argv

ROWS = json.load(open("tools/narration.json", encoding="utf-8"))
SEM = asyncio.Semaphore(CONC)
STAT = {"ok": 0, "skip": 0, "fail": []}


async def one(row):
    out = os.path.join("media", row["file"])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if not FORCE and os.path.exists(out) and os.path.getsize(out) > 1200:
        STAT["skip"] += 1
        return
    async with SEM:
        for attempt in range(4):
            try:
                c = edge_tts.Communicate(row["text"], VOICE, rate=RATE)
                await c.save(out)
                if os.path.getsize(out) > 1200:
                    STAT["ok"] += 1
                    if STAT["ok"] % 10 == 0:
                        print(f"  ...{STAT['ok']} 条", flush=True)
                    return
            except Exception as e:
                await asyncio.sleep(1.2 * (attempt + 1))
        STAT["fail"].append(row["file"])


async def main():
    await asyncio.gather(*[one(r) for r in ROWS])
    print(f"完成：新生成 {STAT['ok']}，跳过已有 {STAT['skip']}，失败 {len(STAT['fail'])}")
    for f in STAT["fail"]:
        print("  × " + f)
    total = 0
    for r in ROWS:
        p = os.path.join("media", r["file"])
        if os.path.exists(p):
            total += os.path.getsize(p)
    print(f"音频合计 {total/1024/1024:.2f} MB / {len(ROWS)} 条")
    if STAT["fail"]:
        sys.exit(1)


asyncio.run(main())
