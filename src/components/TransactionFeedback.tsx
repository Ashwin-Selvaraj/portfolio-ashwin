import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  amount: number;
  from: string;
  to: string;
  isFraudulent: boolean;
  position: { x: number; y: number };
  animationDelay: number;
}

interface FeedbackMessage {
  id: string;
  type: 'success' | 'fraud' | 'bonus';
  message: string;
  position: { x: number; y: number };
}

interface TransactionFeedbackProps {
  validatedTransaction?: Transaction;
  fraudulentTransaction?: Transaction;
}

export const TransactionFeedback: React.FC<TransactionFeedbackProps> = ({
  validatedTransaction,
  fraudulentTransaction
}) => {
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);

  useEffect(() => {
    if (validatedTransaction) {
      const message: FeedbackMessage = {
        id: Math.random().toString(36),
        type: 'success',
        message: '+10 XP - Transaction Validated!',
        position: {
          x: window.innerWidth / 2 - 100,
          y: window.innerHeight / 2 - 50
        }
      };
      
      setFeedbackMessages(prev => [...prev, message]);
      
      // Remove message after 2 seconds
      setTimeout(() => {
        setFeedbackMessages(prev => prev.filter(m => m.id !== message.id));
      }, 2000);
    }
  }, [validatedTransaction]);

  useEffect(() => {
    if (fraudulentTransaction) {
      const message: FeedbackMessage = {
        id: Math.random().toString(36),
        type: 'fraud',
        message: '+25 XP - Fraud Detected!',
        position: {
          x: window.innerWidth / 2 - 100,
          y: window.innerHeight / 2 - 50
        }
      };
      
      setFeedbackMessages(prev => [...prev, message]);
      
      // Remove message after 2 seconds
      setTimeout(() => {
        setFeedbackMessages(prev => prev.filter(m => m.id !== message.id));
      }, 2000);

      // Show bonus message for consecutive fraud detections
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const bonusMessage: FeedbackMessage = {
            id: Math.random().toString(36),
            type: 'bonus',
            message: 'Security Bonus! +15 XP',
            position: {
              x: window.innerWidth / 2 - 80,
              y: window.innerHeight / 2 - 20
            }
          };
          setFeedbackMessages(prev => [...prev, bonusMessage]);
          
          setTimeout(() => {
            setFeedbackMessages(prev => prev.filter(m => m.id !== bonusMessage.id));
          }, 2000);
        }, 500);
      }
    }
  }, [fraudulentTransaction]);

  return (
    <>
      {feedbackMessages.map(feedback => (
        <div
          key={feedback.id}
          className="fixed z-50 pointer-events-none animate-bounce"
          style={{
            left: feedback.position.x,
            top: feedback.position.y,
            animation: 'fade-in-up 2s ease-out forwards'
          }}
        >
          <div className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg border backdrop-blur-sm font-bold
            ${feedback.type === 'success' 
              ? 'bg-green-900/20 border-green-400/30 text-green-300' 
              : feedback.type === 'fraud'
              ? 'bg-red-900/20 border-red-400/30 text-red-300'
              : 'bg-yellow-900/20 border-yellow-400/30 text-yellow-300'
            }
          `}>
            {feedback.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {feedback.type === 'fraud' && <AlertTriangle className="w-5 h-5" />}
            {feedback.type === 'bonus' && <TrendingUp className="w-5 h-5" />}
            <span className="text-sm">{feedback.message}</span>
          </div>
        </div>
      ))}
    </>
  );
};