// root/apps/next-js/src/features/app/automation/components/AddAutomationSheet.tsx

import { Button } from '@teable/ui-lib/shadcn/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@teable/ui-lib/shadcn/ui/sheet';
import { Switch } from '@teable/ui-lib/shadcn/ui/switch';
import React, { useState } from 'react';
import type { INewAutomation } from '../types';

interface AddAutomationSheetProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSave: (newAutomation: INewAutomation) => void;
}

export function AddAutomationSheet({ open, onClose, onSave }: AddAutomationSheetProps) {
  // State для новой автоматизации
  const [newData, setNewData] = useState<INewAutomation>({
    name: '',
    triggerType: '',
    enabled: false,
  });

  // Обработчик сохранения новой автоматизации
  const handleSave = () => {
    if (!newData.name.trim()) return;
    onSave(newData);
    // Сброс данных
    setNewData({
      name: '',
      enabled: false,
      triggerType: '',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Создать автоматизацию</SheetTitle>
          <SheetDescription>Заполните данные для новой автоматизации.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4 px-4 pb-4">
          <label className="flex flex-col text-sm">
            Название
            <input
              className="mt-1 rounded border px-2 py-1"
              value={newData.name}
              onChange={(e) => setNewData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>

          <label className="flex flex-col text-sm">
            Триггер
            <select
              className="mt-1 rounded border px-2 py-1"
              value={newData.triggerType}
              onChange={(e) => {
                const newType = e.target.value as INewAutomation['triggerType'];
                setNewData((prev) => ({ ...prev, triggerType: newType }));
              }}
            >
              <option value="scheduled">scheduled</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={newData.enabled}
              onCheckedChange={(checked) => setNewData((prev) => ({ ...prev, enabled: checked }))}
            />
            Включена
          </label>

          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
