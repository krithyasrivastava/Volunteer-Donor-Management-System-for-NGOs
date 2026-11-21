import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { donationService } from '../../services/resources';
import ReceiptView from '../../components/ReceiptView';

export default function AdminDonationReceipt() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    donationService.receipt(id).then(setReceipt).catch((e) => setError(e.response?.data?.message || 'Failed to load receipt.'));
  }, [id]);

  return <ReceiptView receipt={receipt} error={error} backTo={`/admin/donations/${id}`} backLabel="Back to donation" />;
}
