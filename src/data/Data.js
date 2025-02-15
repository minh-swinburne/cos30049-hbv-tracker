export const mockGraphData = {
  nodes: [
    {
      id: "MFG001",
      name: "HPV Pharma Co.",
      type: "manufacturer",
      stock: "5000 doses",
    },
    {
      id: "DIST001",
      name: "National Distributor",
      type: "distributor",
      stock: "3000 doses",
    },
    {
      id: "HOSP001",
      name: "City Hospital",
      type: "hospital",
      stock: "1000 doses",
    },
  ],
  edges: [
    {
      source: "MFG001",
      target: "DIST001",
      batch: "BATCH123",
      quantity: "2000 doses",
      timestamp: "2024-02-11T10:30:00Z",
      hash: "0xabc...",
    },
    {
      source: "DIST001",
      target: "HOSP001",
      batch: "BATCH123",
      quantity: "1000 doses",
      timestamp: "2024-02-11T11:30:00Z",
      hash: "0xdef...",
    },
  ],
};
