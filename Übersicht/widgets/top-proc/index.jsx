// Übersicht Widget: Top 3 CPU + Memory Processes (transparent, fixed)
export const refreshFrequency = 15000 // every 15 seconds

export const command = `
  { ps -Ao %cpu,%mem,comm | sort -k1 -nr | head -n 3;
    echo "---";
    ps -Ao %cpu,%mem,comm | sort -k2 -nr | head -n 3; } | sed '/^%CPU/d'
`.trim()

export const render = ({ output, error }) => {
  if (error) return <div>⚠️ {String(error)}</div>
  if (!output) return <div>Loading…</div>

  const [cpuRaw, memRaw] = output.split("---")

  const cleanLines = (txt) =>
    txt
      .trim()
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("%CPU") && !l.startsWith("CPU"))

  const parse = (lines) =>
    lines.slice(0, 3).map((line) => {
      const [cpu, mem, ...cmd] = line.trim().split(/\s+/)
      const nameFull = cmd.join(" ")
      const baseName = nameFull.split("/").pop() || nameFull
      const short = baseName.length > 28 ? baseName.slice(0, 25) + "…" : baseName
      return {
        cpu: parseFloat(cpu) || 0,
        mem: parseFloat(mem) || 0,
        name: short,
      }
    })

  const cpuList = parse(cleanLines(cpuRaw || ""))
  const memList = parse(cleanLines(memRaw || ""))

  const fmt = (v) => v.toFixed(1)
  const colorCPU = (v) => (v > 70 ? "#ff5555" : v > 30 ? "#ffb86c" : "#8be9fd")
  const colorMEM = (v) => (v > 50 ? "#ff5555" : v > 20 ? "#ffb86c" : "#8be9fd")

  const renderRow = (p) => (
    <tr key={p.name}>
      <td style={{ ...styles.col1, color: colorCPU(p.cpu) }}>{fmt(p.cpu)}</td>
      <td style={{ ...styles.col2, color: colorMEM(p.mem) }}>{fmt(p.mem)}</td>
      <td style={styles.col3}>{p.name}</td>
    </tr>
  )

  const renderSection = (title, list) => (
    <div style={styles.section}>
      <div style={styles.header}>{title}</div>
      <table style={styles.table}>
        <tbody>
          {list.length > 0
            ? list.map((p) => renderRow(p))
            : [<tr key="none"><td colSpan="3" style={styles.col3}>No data</td></tr>]}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      {renderSection("🧠 Top CPU", cpuList)}
      {renderSection("💾 Top Memory", memList)}
    </div>
  )
}

// ---- SCREEN POSITION + CONTAINER ----
export const className = `
  top: 160px;
  right: 10px;
  color: #e0e0e0;
  font-family: Menlo, monospace;
  font-size: 13px;
  background: rgba(20, 20, 20, 0.35);
  padding: 10px 12px;
  border-radius: 10px;
  line-height: 1.4em;
  max-width: 30vw;
  box-shadow: 0 0 8px rgba(0,0,0,0.25);
`

// ---- INTERNAL STYLES ----
const styles = {
  section: { marginBottom: "10px" },
  header: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#2aa198",
    marginBottom: "4px",
  },
  table: { borderCollapse: "collapse", width: "100%" },
  col1: { width: "45px", textAlign: "right", paddingRight: "6px" },
  col2: { width: "50px", textAlign: "right", paddingRight: "6px" },
  col3: {
    color: "#fdf6e3",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}

