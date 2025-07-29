import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Phone, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedPhoneNumberProps {
  className?: string;
}

const SavedPhoneNumber: React.FC<SavedPhoneNumberProps> = ({ className }) => {
  const [savedPhone, setSavedPhone] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved phone number from localStorage
    const stored = localStorage.getItem('savedWithdrawalPhone');
    if (stored) {
      setSavedPhone(stored);
      setCurrentPhone(stored);
    }
  }, []);

  const handleSave = () => {
    if (!currentPhone.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    // Validate phone format
    const phoneRegex = /^(\+?254|0)?7\d{8}$/;
    if (!phoneRegex.test(currentPhone.replace(/\s+/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('savedWithdrawalPhone', currentPhone);
    setSavedPhone(currentPhone);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Phone number saved for withdrawals",
    });
  };

  const formatPhoneNumber = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.startsWith('254')) {
      return clean;
    } else if (clean.startsWith('0')) {
      return `254${clean.substring(1)}`;
    } else if (clean.startsWith('7')) {
      return `254${clean}`;
    }
    return clean;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Saved Withdrawal Phone
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone-input">Phone Number</Label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="2547XXXXXXXX or 07XXXXXXXX"
                value={currentPhone}
                onChange={(e) => setCurrentPhone(formatPhoneNumber(e.target.value))}
                maxLength={13}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPhone(savedPhone);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPhone ? (
              <>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-mono text-lg">{savedPhone}</p>
                  <p className="text-sm text-muted-foreground">This number will be used for withdrawals</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Change Number
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">No phone number saved</p>
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Add Phone Number
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedPhoneNumber;
