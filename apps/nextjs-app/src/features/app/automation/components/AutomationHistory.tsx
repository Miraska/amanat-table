// root/apps/next-js/src/features/app/automation/components/AutomationHistory.tsx

import React from 'react';
import type { AutomationRunLog } from '../types';

interface AutomationHistoryProps {
  logs: AutomationRunLog[];
  automationId: string;
}

export function AutomationHistory({ logs, automationId }: AutomationHistoryProps) {
  const filteredLogs = logs.filter((log) => log.automationId === automationId);

  if (!filteredLogs.length) {
    return <div className="p-4 text-sm text-gray-500">Нет запусков для этой автоматизации</div>;
  }

  return (
    <div className="p-4">
      <h3 className="mb-2 text-lg font-semibold">История запусков</h3>
      <ul className="space-y-2">
        {filteredLogs.map((log) => (
          <li key={log.id} className="border p-2 text-sm">
            <div>
              <strong>Запуск #{log.id}</strong> — {log.status.toUpperCase()}
            </div>
            <div>Начало: {log.startedAt.toLocaleString()}</div>
            {log.finishedAt && <div>Конец: {log.finishedAt.toLocaleString()}</div>}
            {log.message && <div>Сообщение: {log.message}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
