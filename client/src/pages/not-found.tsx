import React from 'react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-300 mb-8">Maaf, halaman yang Anda cari tidak ada.</p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}