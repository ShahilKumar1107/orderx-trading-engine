export default function TradeHistory({ trades }) {
  return (
    <div className="bottom-content">
      {trades.length === 0 ? (
        <div className="empty-state">No trades executed yet</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Price (USD)</th>
              <th>Qty (BTC)</th>
              <th>Buyer</th>
              <th>Seller</th>
            </tr>
          </thead>
          <tbody>
            {[...trades].reverse().map((trade) => (
              <tr key={trade.id}>
                <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
                <td style={{ color: '#3fb950' }}>${trade.price.toLocaleString()}</td>
                <td>{trade.quantity}</td>
                <td>{trade.buyerId}</td>
                <td>{trade.sellerId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}