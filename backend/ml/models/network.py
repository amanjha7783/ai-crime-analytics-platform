from __future__ import annotations

import pandas as pd
import networkx as nx

def build_criminal_network(frame: pd.DataFrame, focus_node: str | None = None, max_nodes: int = 500) -> dict:
    """Builds a knowledge graph from crime data using networkx."""
    
    G = nx.Graph()
    
    # Extract entities
    for _, row in frame.iterrows():
        fir_id = f"FIR-{row['fir_id']}"
        offender_id = str(row["offender_id"])
        district = f"DIST-{row['district']}"
        station = f"STA-{row['police_station']}"
        crime_type = f"TYPE-{row['crime_type']}"
        
        # Add nodes with attributes
        G.add_node(fir_id, label=fir_id, type="fir", risk_level=row.get("risk_level", "Medium"))
        G.add_node(offender_id, label=offender_id, type="offender", risk_score=row.get("risk_score", 0))
        G.add_node(district, label=row['district'], type="district")
        G.add_node(station, label=row['police_station'], type="station")
        G.add_node(crime_type, label=row['crime_type'], type="crime_type")
        
        # Add edges
        G.add_edge(offender_id, fir_id, type="involved_in", weight=1)
        G.add_edge(fir_id, station, type="registered_at", weight=1)
        G.add_edge(station, district, type="located_in", weight=1)
        G.add_edge(fir_id, crime_type, type="classified_as", weight=1)
        
        if pd.notna(row.get("weapon_used")):
            weapon = f"WPN-{row['weapon_used']}"
            G.add_node(weapon, label=row['weapon_used'], type="weapon")
            G.add_edge(fir_id, weapon, type="used_in", weight=1)

    # Compute graph metrics (using a smaller subgraph if it's too large to compute quickly)
    metrics = {
        "total_nodes": G.number_of_nodes(),
        "total_edges": G.number_of_edges(),
        "density": round(nx.density(G), 5)
    }
    
    # Filter for frontend
    if focus_node and G.has_node(focus_node):
        # Extract ego graph
        subgraph = nx.ego_graph(G, focus_node, radius=2)
    else:
        # Get highest degree offender nodes
        offenders = [n for n, d in G.nodes(data=True) if d.get('type') == 'offender']
        degrees = {n: G.degree(n) for n in offenders}
        top_offenders = sorted(degrees, key=degrees.get, reverse=True)[:50]
        
        # Include their neighbors
        nodes_to_keep = set(top_offenders)
        for node in top_offenders:
            nodes_to_keep.update(G.neighbors(node))
            
        # Ensure we don't exceed max_nodes drastically
        if len(nodes_to_keep) > max_nodes:
            nodes_to_keep = list(nodes_to_keep)[:max_nodes]
            
        subgraph = G.subgraph(nodes_to_keep)

    # Convert to JSON format
    nodes = []
    for node, data in subgraph.nodes(data=True):
        nodes.append({"id": node, **data})
        
    edges = []
    for source, target, data in subgraph.edges(data=True):
        edges.append({"source": source, "target": target, **data})

    return {
        "nodes": nodes,
        "edges": edges,
        "metrics": metrics,
        "central_criminals": [] # Calculate if needed
    }
