export const refreshFrequency = 60000; // every 60 seconds

// safer curl call with 5s timeout
export const command =
  'curl -s --max-time 5 https://api.ipify.org || echo "Unavailable"'

export const render = ({ output, error }) => {
  if (error) return <div>⚠️ Error: {String(error)}</div>
  const ip = (output || "").trim() || "Fetching..."
  return (
    <div>
      🌐 <span style={{ color: "#00ffff", fontWeight: "bold" }}>{ip}</span>
    </div>
  )
}

// This controls screen position and container styling
export const className = `
  top: 50px;
  right: 20px;
  color: #00ff99;
  font-family: Menlo, monospace;
  font-size: 14px;
  background: rgba(0,0,0,0.45);
  padding: 6px 12px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
`

