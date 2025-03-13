// root/apps/next-js/src/features/app/automation/components/AutomationDetailsSheet.tsx

import { Button } from '@teable/ui-lib/shadcn/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@teable/ui-lib/shadcn/ui/sheet';
import { Switch } from '@teable/ui-lib/shadcn/ui/switch';
import React, { useState, useEffect } from 'react';
import type { IAutomation } from '../types';

interface AutomationDetailsSheetProps {
  open: boolean;
  automation: IAutomation | null;
  onClose: (open: boolean) => void;
  onSave: (updatedAutomation: IAutomation) => void;
}

export function AutomationDetailsSheet({
  open,
  automation,
  onClose,
  onSave,
}: AutomationDetailsSheetProps) {
  const [localData, setLocalData] = useState<IAutomation | null>(automation);

  useEffect(() => {
    setLocalData(automation);
  }, [automation]);

  if (!localData) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Настройки автоматизации</SheetTitle>
          <SheetDescription>Измените основные данные.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4 px-4 pb-4">
          <label className="flex flex-col text-sm">
            Название
            <input
              className="mt-1 rounded border px-2 py-1"
              value={localData.name}
              onChange={(e) =>
                setLocalData((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
            />
          </label>

          <label className="flex flex-col text-sm">
            Триггер
            <select
              className="mt-1 rounded border px-2 py-1"
              value={localData.triggerType}
              onChange={(e) => {
                const newType = e.target.value as IAutomation['triggerType'];
                setLocalData((prev) => (prev ? { ...prev, triggerType: newType } : null));
              }}
            >
              <option value="onCheck">onCheck</option>
              <option value="onCreate">onCreate</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={localData.enabled}
              onCheckedChange={(checked) =>
                setLocalData((prev) => (prev ? { ...prev, enabled: checked } : null))
              }
            />
            Включена
          </label>

          <Button
            onClick={() => {
              if (localData) {
                onSave(localData);
              }
            }}
          >
            Сохранить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
