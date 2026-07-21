"use client";

import dynamic from "next/dynamic";

const ForceGraph = dynamic(() => import("./NoSSRForceGraph"), {
  ssr: false,
});

export default ForceGraph;
