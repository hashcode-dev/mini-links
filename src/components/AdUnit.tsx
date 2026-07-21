import { useEffect } from 'react';

interface AdUnitProps {
  slotId?: string;
  publisherId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

/**
 * Guarded AdSense AdUnit Component.
 * Prevents rendering empty dashed placeholder boxes or throwing errors when ad slots are unapproved.
 * Returns null if slotId is unassigned or dummy to avoid "Unfilled Ad Slot" policy violations.
 */
export default function AdUnit({
  slotId,
  publisherId = 'ca-pub-0000000000000000', // Replace with production Publisher ID when approved
  format = 'auto',
  className = '',
}: AdUnitProps) {
  // Hide component cleanly if slotId is missing or unassigned during site review phase
  if (!slotId || slotId.includes('dummy') || slotId === '1234567890' || slotId === '0000000000') {
    return null;
  }

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, [slotId]);

  return (
    <div className={`ad-container my-6 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', minHeight: '90px' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
