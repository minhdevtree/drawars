import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="w-full h-full absolute inset-0 bg-background z-50 flex items-center justify-center">
      <Card className="p-6 shadow-lg rounded-md">
        <CardContent className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-primary w-16 h-16 mb-4" />
          <h2 className="text-primary">Loading, please wait...</h2>
        </CardContent>
      </Card>
    </div>
  );
}
