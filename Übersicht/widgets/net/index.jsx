export const refreshFrequency = 2000 // update every 2 seconds

// Measure RX/TX bytes on your active interface (usually en0)
export const command = `
  IFACE=$(route get default 2>/dev/null | awk '/interface:/{print $2; exit}');
  R1=$(netstat -ib | awk -v iface="$IFACE" '$1==iface && $7 ~ /^[0-9]+$/ {rx+=$7; tx+=$10} END {print rx,tx}');
  sleep 1;
  R2=$(netstat -ib | awk -v iface="$IFACE" '$1==iface && $7 ~ /^[0-9]+$/ {rx+=$7; tx+=$10} END {print rx,tx}');
  set -- $R1; RX1=$1; TX1=$2;
  set -- $R2; RX2=$1; TX2=$2;
  echo "$((RX2-RX1)) $((TX2-TX1))"
`.trim()

export const render = ({ output, error }) => {
  if (error) return <div>⚠️ {String(error)}</div>
  if (!output) return <div>Measuring…</div>

  const [rxStr, txStr] = output.trim().split(" ")
  const rx = parseInt(rxStr, 10)
  const tx = parseInt(txStr, 10)
  if (isNaN(rx) || isNaN(tx)) return <div>No data</div>

  // Convert bytes/sec to kilobits/sec
  const fmt = (bytesPerSec) => ((bytesPerSec * 8) / 1000).toFixed(1)

  return (
    <div>
      <div>⬇ {fmt(rx)} Kbps</div>
      <div>⬆ {fmt(tx)} Kbps</div>
    </div>
  )
}

// Übersicht's canonical styling + placement
export const className = `
  top: 90px;
  right: 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: #00ff99;
  font-family: Menlo, monospace;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.4em;
  backdrop-filter: blur(4px);
`

