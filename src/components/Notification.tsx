import React from 'react';
import { XCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export default function Notification({ message, onClose }: NotificationProps) {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="text-red-700 hover:text-red-800">
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
}