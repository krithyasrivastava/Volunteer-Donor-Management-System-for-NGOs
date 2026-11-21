import { Loading, ErrorState } from './States';

export default function ReceiptView({ receipt, error, backTo, backLabel }) {
  if (error) return <ErrorState message={error} />;
  if (!receipt) return <Loading />;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {backTo && <a href={backTo} className="text-sm text-forest-500 hover:text-forest-800">&larr; {backLabel || 'Back'}</a>}

      <div className="card border-2 border-forest-100 print:shadow-none" id="receipt-print">
        <div className="flex items-center justify-between border-b border-dashed border-forest-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-forest-700 text-white flex items-center justify-center font-display font-bold">G</div>
            <div>
              <p className="font-display font-semibold text-forest-900">{receipt.ngo_name}</p>
              <p className="text-xs text-forest-500">Official Donation Receipt</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-forest-500">Receipt ID</p>
            <p className="font-medium text-forest-800">{receipt.receipt_id}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <div><dt className="text-forest-500">Donor name</dt><dd className="text-forest-800 font-medium">{receipt.donor_name}</dd></div>
          <div><dt className="text-forest-500">Donor ID</dt><dd className="text-forest-800">DNR-{String(receipt.donor_id).padStart(5, '0')}</dd></div>
          <div><dt className="text-forest-500">Date</dt><dd className="text-forest-800">{receipt.date}</dd></div>
          <div><dt className="text-forest-500">Status</dt><dd className="text-forest-800">{receipt.status}</dd></div>
          <div><dt className="text-forest-500">Donation type</dt><dd className="text-forest-800">{receipt.donation_type}</dd></div>
          <div><dt className="text-forest-500">Payment method</dt><dd className="text-forest-800">{receipt.payment_method}</dd></div>
          <div className="col-span-2"><dt className="text-forest-500">Purpose</dt><dd className="text-forest-800">{receipt.purpose || 'General fund'}</dd></div>
        </dl>

        <div className="mt-5 rounded-xl bg-forest-50 p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-forest-700">Amount</span>
          <span className="text-xl font-display font-bold text-forest-900">
            {receipt.donation_type === 'Money' ? `₹${Number(receipt.amount).toLocaleString('en-IN')}` : receipt.donation_type}
          </span>
        </div>

        <p className="text-sm text-forest-600 mt-5 italic border-t border-dashed border-forest-200 pt-4">
          {receipt.thank_you_message}
        </p>
      </div>

      <div className="flex justify-end print:hidden">
        <button className="btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
    </div>
  );
}
