export interface ProjectItem {
  title: string;
  client: string;
  category: string;
  year: string;
  desc: string;
  longdesc: string;
  tags: string[];
  featured: boolean;
  image: string;
  description: string;
  href?: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    title: "Maxwell Chemical Telemetry",
    client: "Maxwell Chemicals",
    category: "IoT & Industrial Automation",
    year: "2026",
    desc: "High-frequency sensor telemetry pipeline and edge cloud infrastructure for continuous industrial chemical reactor monitoring.",
    longdesc: "Engineered an edge-to-cloud telemetry backbone collecting 50,000+ data points per second across chemical processing plants. Features sub-second anomaly detection, fault-tolerant local ring buffers, and encrypted cloud synchronization.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    description: "High-frequency sensor telemetry pipeline and edge cloud infrastructure for continuous industrial chemical reactor monitoring.",
    tags: ["IoT Core", "Go", "TimescaleDB", "MQTT", "Grafana"],
    featured: true
  },
  {
    title: "SynchronizeTeams Workspace",
    client: "SynchronizeTeams",
    category: "Cloud Platform & WebSockets",
    year: "2026",
    desc: "Ultra-low latency real-time collaborative workspace with CRDT-based multi-cursor editing and distributed state sync.",
    longdesc: "Built from scratch to support high-concurrency engineering rooms with conflict-free document replication, spatial audio presence, and sub-50ms peer synchronization over global edge nodes.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80",
    description: "Ultra-low latency real-time collaborative workspace with CRDT-based multi-cursor editing and distributed state sync.",
    tags: ["React 19", "WebSockets", "CRDT (Yjs)", "Rust", "Redis"],
    featured: true
  },
  {
    title: "ILW Global Supply ERP",
    client: "PT. International Leather Works",
    category: "Enterprise Systems & ERP",
    year: "2025",
    desc: "Multi-facility manufacturing ERP managing worldwide export-import logistics, barcode tracking, and automated inventory reconciliation.",
    longdesc: "Replaced legacy fragmented spreadsheets with a consolidated digital manufacturing hub. Integrates automated tax customs documentation, production line tracking, and multi-currency billing across 4 countries.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
    description: "Multi-facility manufacturing ERP managing worldwide export-import logistics, barcode tracking, and automated inventory reconciliation.",
    tags: ["Next.js", "PostgreSQL", "Node.js", "Docker", "Tailwind CSS"],
    featured: true
  },
  {
    title: "Devaccto RPL Talent Engine",
    client: "Devaccto RPL",
    category: "EdTech & Code Execution Runtime",
    year: "2025",
    desc: "Isolated sandboxed code runner and automated technical skill benchmarking engine for 25,000+ developer candidates.",
    longdesc: "Engineered secure gVisor-isolated container sandboxes that execute untrusted multi-language user code safely within 200ms, featuring memory throttling, automated test suites, and anti-cheat telemetry.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    description: "Isolated sandboxed code runner and automated technical skill benchmarking engine for 25,000+ developer candidates.",
    tags: ["Kubernetes", "gVisor", "TypeScript", "Python", "gRPC"],
    featured: true
  },
  {
    title: "Sarana Nusa AgroLogistics",
    client: "Sarana Nusa Pakan",
    category: "Smart Agriculture & Logistics",
    year: "2025",
    desc: "Predictive livestock feed replenishment system with cellular silo weight telemetry and dynamic distribution routing.",
    longdesc: "Empowers agricultural distribution hubs with real-time level monitoring across distributed farm silos, automated predictive restock dispatch, and route fuel optimization.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    description: "Predictive livestock feed replenishment system with cellular silo weight telemetry and dynamic distribution routing.",
    tags: ["IoT Telemetry", "Next.js", "FastAPI", "Mapbox GL", "PostGIS"],
    featured: true
  },
  {
    title: "AegisGuard Cloud Shield",
    client: "ANEXT Security Labs",
    category: "Cyber Security & Infrastructure",
    year: "2026",
    desc: "Proactive cloud security operations center with eBPF-driven kernel packet inspection and automated mitigation.",
    longdesc: "Real-time threat surface defense detecting anomalous east-west network traffic inside Kubernetes clusters, automatically synthesizing iptables mitigations and compliance audit logs.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
    description: "Proactive cloud security operations center with eBPF-driven kernel packet inspection and automated mitigation.",
    tags: ["eBPF", "Kubernetes", "Zero Trust", "Terraform", "AWS"],
    featured: false
  },
  {
    title: "OmniPulse Edge Gateway",
    client: "ANEXT Hardware Systems",
    category: "Hardware & Edge Computing",
    year: "2026",
    desc: "Ultra-low-power industrial MQTT gateway with dual cellular and satellite failover for off-grid operations.",
    longdesc: "Custom hardware firmware and power-management circuitry engineered for remote telemetry monitoring in challenging maritime and industrial environments.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    description: "Ultra-low-power industrial MQTT gateway with dual cellular and satellite failover for off-grid operations.",
    tags: ["Embedded C++", "FreeRTOS", "MQTT-SN", "AWS IoT Core", "PCB Design"],
    featured: false
  }
];
