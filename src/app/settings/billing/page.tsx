"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
  orderId: string;
}

export default function BillingHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/history")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[Billing History] Error:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-orange-100 text-orange-700";
      case "FAILED":
      case "EXPIRED":
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-cream px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-brown-900 mb-1">
              Riwayat Pembayaran
            </h1>
            <p className="text-brown-700 text-sm">
              Semua transaksi upgrade Zyba Plus Anda
            </p>
          </div>
          <button
            onClick={() => router.push("/settings/zyba-plus")}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors text-sm"
          >
            Upgrade Paket
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-brown-700">Memuat riwayat...</div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-brown-900/10">
            <p className="text-brown-700 mb-4">Belum ada riwayat pembayaran</p>
            <button
              onClick={() => router.push("/settings/zyba-plus")}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
            >
              Upgrade ke Zyba Plus
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-2xl p-5 border border-brown-900/10 shadow-sm flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-brown-900">Zyba Plus - Langganan Bulanan</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-sm text-brown-700">
                    {formatDate(payment.createdAt)}
                  </p>
                  <p className="text-xs text-brown-600 font-mono mt-1">
                    Order ID: {payment.orderId}
                  </p>
                  {payment.paymentMethod && (
                    <p className="text-xs text-brown-600 mt-0.5">
                      Metode: {payment.paymentMethod}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brown-900">
                    {formatAmount(payment.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
