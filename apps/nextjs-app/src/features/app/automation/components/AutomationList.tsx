// root/apps/next-js/src/features/app/automation/components/AutomationList.tsx

import { Button } from '@teable/ui-lib/shadcn/ui/button';
import { Switch } from '@teable/ui-lib/shadcn/ui/switch';
import React from 'react';
import type { IAutomation } from '../types';

interface AutomationListProps {
  automations: IAutomation[]; // Массив автоматизации
  selectedId: string | null; // Id выбранной автоматизации
  onSelect: (id: string) => void; // Обработчик onDelete для выбора автоматизации
  onToggle: (id: string) => void; // Обработчик onDelete для вкл/выкл автоматизации
  onDelete: (id: string) => void; // Обработчик onDelete для удаления автоматизации
  // onDuplicate: (id: string) => void;
  handleOpenAddAutomation: () => void; // Обработчик октрытия бокового окна для добавления автоматизации
}

export function AutomationList({
  automations,
  selectedId,
  onSelect,
  onToggle,
  onDelete,
  // onDuplicate,
  handleOpenAddAutomation,
}: AutomationListProps): React.JSX.Element {
  return (
    <div className="w-full border-r border-[hsl(var(--border))] bg-[hsl(var(--background))]  sm:w-64">
      <div className="flex justify-between p-4 text-lg font-semibold dark:text-white">
        Список автоматизаций
      </div>

      <ul>
        {/* Перебор и вывод списка автоматизаций */}

        {automations.map((automation) => (
          <li
            key={automation.id}
            className={`cursor-pointer border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3
            ${selectedId === automation.id ? 'font-medium' : ''}`}
          >
            <button className="w-full" onClick={() => onSelect(automation.id)}>
              <div className="flex items-center justify-between">
                <span>{automation.name}</span>
                <Switch
                  checked={automation.enabled}
                  onCheckedChange={() => onToggle(automation.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="text-xs text-muted-foreground">Нет описания</div>

              <div className="mt-2 flex gap-2 text-xs">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Дублировать
                </Button>
                <Button
                  variant="destructive"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(automation.id);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="mx-4 mb-4 mt-2 flex flex-row">
        <Button onClick={handleOpenAddAutomation}>Добавить</Button>
      </div>
    </div>
  );
}
