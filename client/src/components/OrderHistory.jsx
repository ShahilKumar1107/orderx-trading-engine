export default function OrderHistory({ snapshot }) {
  const { bids, asks } = snapshot;

  const allOrders = [
    ...bids.flatMap(l => l.orders.map(o => ({ ...o, status: 'pending' }))),
    ...asks.flatMap(l => l.orders.map(o => ({ ...o, status: 'pending' })))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="bottom-content">
      {allOrders.length === 0 ? (
        <div className="empty-state">No open orders</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Price (USD)</th>
              <th>Qty (BTC)</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.timestamp).toLocaleTimeString()}</td>
                <td>
                  <span className={`badge badge-${order.type}`}>
                    {order.type.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: order.type === 'buy' ? '#3fb950' : '#f85149' }}>
                  ${order.price.toLocaleString()}
                </td>
                <td>{order.quantity}</td>
                <td>{order.userId}</td>
                <td><span className="badge badge-pending">PENDING</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}