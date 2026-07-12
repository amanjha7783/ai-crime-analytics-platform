from __future__ import annotations

import pandas as pd


def build_criminal_network(frame: pd.DataFrame) -> dict:
    offender_counts = frame.groupby("offender_id")["fir_id"].count().to_dict()
    district_counts = frame.groupby("district")["fir_id"].count().to_dict()

    nodes = [
        {"id": offender, "label": offender, "type": "offender", "weight": int(count)}
        for offender, count in offender_counts.items()
    ]
    nodes.extend(
        {"id": district, "label": district, "type": "district", "weight": int(count)}
        for district, count in district_counts.items()
    )
    edges = [
        {
            "source": row["offender_id"],
            "target": row["district"],
            "type": "reported_in",
            "weight": int(row["repeat_offender_count"]),
        }
        for row in frame[["offender_id", "district", "repeat_offender_count"]].drop_duplicates().to_dict("records")
    ]
    central = sorted(
        [
            {"id": offender, "centrality": round(count / max(sum(offender_counts.values()), 1), 3)}
            for offender, count in offender_counts.items()
        ],
        key=lambda row: row["centrality"],
        reverse=True,
    )
    return {"nodes": nodes, "edges": edges, "central_criminals": central[:5], "communities": list(district_counts)}
