// Übersicht Widget: Modern TODO List (consistent with top-procs)
export const refreshFrequency = 30000 // refresh every 30 seconds

// ---- CONFIG ----
export const config = {
  todoFile:
    "/Users/abdulrahmanalshawi/Library/Application Support/Übersicht/widgets/todo/todo.md",
  script:
    "/Users/abdulrahmanalshawi/Library/Application Support/Übersicht/widgets/todo/parse_todo.py",
}

// ---- COMMAND ----
export const command = `/usr/bin/python3 '${config.script}' '${config.todoFile}'`

// ---- RENDER ----
export const render = ({ output, error }) => {
  if (error) return <div>⚠️ {String(error)}</div>
  if (!output) return <div>Loading…</div>

  let data
  try {
    data = JSON.parse(output)
  } catch {
    return <div>⚠️ Error parsing output</div>
  }

  if (data.error) return <div>⚠️ {data.error}</div>

  const today = new Date()
  const sectioned = data.reduce((acc, t) => {
    acc[t.section] = acc[t.section] || []
    acc[t.section].push(t)
    return acc
  }, {})

  const fmtColor = (item) =>
    item.done
      ? "#586e75"
      : item.date
      ? new Date(item.date) < today
        ? "#ff5555"
        : new Date(item.date) - today < 3 * 86400000
        ? "#ffb86c"
        : "#8be9fd"
      : "#fdf6e3"

  return (
    <div>
      {Object.entries(sectioned).map(([section, items]) => (
        <div key={section} style={styles.section}>
          <div style={styles.header}>{section}</div>
          {items.map((item, i) => {
            const color = fmtColor(item)
            return (
              <div key={i} style={styles.item}>
                <span style={{ color }}>{item.done ? "✅" : "•"} </span>
                <span
                  style={{
                    textDecoration: item.done ? "line-through" : "none",
                    color,
                  }}
                >
                  {item.text}
                </span>
                {item.date && (
                  <span style={styles.date}>⏱ {item.date}</span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ---- STYLES ----
const styles = {
  section: { marginBottom: "10px" },
  header: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#2aa198",
    marginBottom: "4px",
  },
  item: { marginLeft: "10px", marginBottom: "3px" },
  date: { color: "#8be9fd", fontSize: "12px", marginLeft: "5px" },
}

// ---- SCREEN POSITION + MAIN CONTAINER STYLING ----
export const className = `
  top: 50px;
  left: 20px;
  color: #fdf6e3;
  font-family: Menlo, monospace;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.35);
  padding: 10px 12px;
  border-radius: 10px;
  line-height: 1.4em;
  max-width: 30vw;
  box-shadow: 0 0 8px rgba(0,0,0,0.35);
`

