import { Button } from '@teable/ui-lib/shadcn/ui/button';
import React, { useEffect, useState } from 'react';

import { AddAutomationSheet } from './components/AddAutomationSheet';
import { AutomationList } from './components/AutomationList';
import fetchCreateAutomation from './lib/fetchCreateAutomation';
import fetchDeleteAutomation from './lib/fetchDeleteAutomation';
import fetchToggleAutomation from './lib/fetchToggleAutomation';
import getAutomationActions from './lib/getAutomationActions';
import getListAutomations from './lib/getListAutomations';
import type { IAutomation, INewAutomation } from './types';

// Простая кеширующая переменная для автоматизаций
let cachedAutomations: IAutomation[] | null = null;

export function AutomationPage() {
  const [automations, setAutomations] = useState<IAutomation[]>([]); // Автоматизации
  const [selectedId, setSelectedId] = useState<string | null>(null); // Выбранная автоматизация
  const [isAddAutomationSheetOpen, setIsAddAutomationSheetOpen] = useState(false); // Состояние модального окна добавления автоматизации

  const selectedAutomation = automations.find((a) => a.id === selectedId) || null; // Выбранная автоматизация

  useEffect(() => {
    // Поверхностная функция для получения данных через useEffect
    async function fetchData() {
      if (cachedAutomations) {
        setAutomations(cachedAutomations);
        if (!selectedId && cachedAutomations.length > 0) {
          setSelectedId(cachedAutomations[0].id);
        }
      } else {
        const list = await getListAutomations();
        list.map(async (item) => {
          item.actions = await getAutomationActions(item.id);
        });

        cachedAutomations = list;
        setAutomations(list);
        if (!selectedId && list.length > 0) {
          setSelectedId(list[0].id);
        }
      }
    }
    fetchData();
  }, [setAutomations]);

  // Дебаг функция
  function debug<Type>(msg?: Type): void {
    console.debug('[DEBUG]: ', msg ?? automations);
  }

  // Обработчик переключение статуса автоматизации
  const handleToggleAutomation = (automationId: string) => {
    const automation = automations.find((item) => item.id === automationId);
    if (!automation) return;

    const newState = !automation.enabled;

    try {
      // Сначала отправляем запрос на сервер и ждем его завершения
      fetchToggleAutomation(automationId, newState);

      // Обновляем состояние только после успешного запроса
      setAutomations((prev) =>
        prev.map((item) => (item.id === automationId ? { ...item, enabled: newState } : item))
      );
    } catch (error) {
      console.error('Ошибка обновления состояния автоматизации:', error);
    }
  };

  // Обработчик удаления автоматизации
  const handleDeleteAutomation = async (automationId: string) => {
    try {
      // Выполняем DELETE-запрос по адресу с id автоматизации
      await fetchDeleteAutomation(automationId);
      console.log(`Automation ${automationId} deleted successfully.`);

      // Обновляем состояние: удаляем автоматизацию из списка
      const newAutomations = automations.filter((a) => a.id !== automationId);
      setAutomations(newAutomations);

      if (selectedId === automationId) {
        setSelectedId(newAutomations[0]?.id ?? null);
      }

      // Обновляем кеш
      cachedAutomations = newAutomations;
    } catch (error) {
      console.error(`Error deleting automation ${automationId}:`, error);
    }
  };

  // Обработчик создания новой автоматизации
  const handleCreateNewAutomation = async (newAutomation: INewAutomation) => {
    try {
      // Выполняем запрос на сервер
      const data = await fetchCreateAutomation(newAutomation);
      console.log('New automation saved:', data);

      // Обновляем состояние и кеш
      const updatedAutomations = [...automations, data];
      setAutomations(updatedAutomations);
      cachedAutomations = updatedAutomations;

      setIsAddAutomationSheetOpen(false);
      setSelectedId(data.id);
    } catch (error) {
      console.error('Error saving new automation:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">
            {selectedAutomation?.name ?? 'Выберите автоматизацию'}
          </h2>
          <Button onClick={() => debug()}>Дебаг</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Посмотреть историю</Button>
          <Button variant="outline">Тест автоматизаций</Button>
          <Button variant="outline">Редактировать</Button>
          <Button>Добавить шаг</Button>
        </div>
      </div>

      {/* Компонент для списка автоматизация */}
      <div className="flex flex-1 overflow-hidden">
        <AutomationList
          automations={automations}
          selectedId={selectedId}
          handleOpenAddAutomation={() => {
            setIsAddAutomationSheetOpen(true);
          }}
          onSelect={setSelectedId}
          onToggle={handleToggleAutomation}
          onDelete={handleDeleteAutomation}
        />
      </div>

      {/* Создание новой автоматизации */}
      <AddAutomationSheet
        open={isAddAutomationSheetOpen}
        onClose={setIsAddAutomationSheetOpen}
        onSave={handleCreateNewAutomation}
      />
    </div>
  );
}
