import PropTypes from "prop-types";

const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center p-4 text-slate-500">
        No transactions available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Target
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {transactions.map((tx, index) => (
            <tr key={tx.hash || index} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {tx.source?.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {tx.target?.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {tx.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionTable.displayName = "TransactionTable";
TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      source: PropTypes.shape({
        id: PropTypes.string,
      }),
      target: PropTypes.shape({
        id: PropTypes.string,
      }),
      value: PropTypes.number,
    })
  ),
};

export default TransactionTable;
