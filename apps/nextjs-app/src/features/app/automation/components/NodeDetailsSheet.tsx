// root/apps/next-js/src/features/app/automation/components/NodeDetailsSheet.tsx

import { Button } from '@teable/ui-lib/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@teable/ui-lib/shadcn/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@teable/ui-lib/shadcn/ui/sheet';
import React from 'react';
import type { IAction, Condition } from '../types';
import AutamationScriptEditor from './AutamationScriptEditor';

interface NodeDetailsSheetProps {
  open: boolean;
  node: IAction | null;
  onClose: (open: boolean) => void;
  onSave: (updatedNode: IAction) => void;
  onDelete: () => void;
}

export function NodeDetailsSheet({ open, node, onClose, onSave, onDelete }: NodeDetailsSheetProps) {
  const [localNode, setLocalNode] = React.useState<IAction | null>(node);
  const [isScriptModalOpen, setIsScriptModalOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalNode(node);
  }, [node]);

  if (!localNode) return null;

  const addCondition = () => {
    if (localNode.type !== 'logic') return;
    const newCondition: Condition = {
      field: '',
      operator: '==',
      value: '',
    };
    const updatedConditions = [...(localNode.conditions || []), newCondition];
    setLocalNode({ ...localNode, conditions: updatedConditions });
  };

  const updateCondition = (condIndex: number, updatedCond: Condition) => {
    if (!localNode.conditions) return;
    const newConditions = [...localNode.conditions];
    newConditions[condIndex] = updatedCond;
    setLocalNode({ ...localNode, conditions: newConditions });
  };

  const removeCondition = (condIndex: number) => {
    if (!localNode.conditions) return;
    const newConditions = [...localNode.conditions];
    newConditions.splice(condIndex, 1);
    setLocalNode({ ...localNode, conditions: newConditions });
  };

  // Функция для обновления скрипта в состоянии localNode
  const handleScriptChange = (newScript: string) => {
    setLocalNode((prev) => (prev ? { ...prev, script: newScript } : null));
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Редактирование шага</SheetTitle>
            <SheetDescription>Измените параметры шага вашей автоматизации.</SheetDescription>
          </SheetHeader>

          <div className="mt-4 flex flex-col gap-4 px-4 pb-4">
            {/* Название шага */}
            <label className="flex flex-col text-sm">
              Название шага
              <input
                className="mt-1 rounded border px-2 py-1"
                value={localNode.label}
                onChange={(e) =>
                  setLocalNode((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
              />
            </label>

            {/* Тип шага */}
            <label className="flex flex-col text-sm">
              Тип шага
              <select
                className="mt-1 rounded border px-2 py-1"
                value={localNode.type}
                onChange={(e) => {
                  const newType = e.target.value as IAction['type'];
                  const updatedNode = { ...localNode, type: newType };
                  if (newType !== 'logic') {
                    updatedNode.conditions = [];
                  }
                  if (newType !== 'script') {
                    updatedNode.inputVars = undefined;
                  }
                  setLocalNode(updatedNode);
                }}
              >
                <option value="trigger">Триггер</option>
                <option value="logic">Логический</option>
                <option value="action">Дейтсвие</option>
                <option value="script">Скрипт</option>
              </select>
            </label>

            {/* Кнопка для редактирования скрипта */}
            {localNode.type === 'script' && (
              <Button onClick={() => setIsScriptModalOpen(true)}>Редактировать скрипт</Button>
            )}

            {/* Если шаг — логический, показываем conditions */}
            {localNode.type === 'logic' && (
              <div className="border p-2">
                <div className="mb-2 font-semibold">Условия</div>
                <label className="mb-2 flex flex-col text-sm">
                  Оператор между условиями (AND/OR)
                  <select
                    className="mt-1 rounded border px-2 py-1"
                    value={localNode.conditions ?? 'AND'}
                    onChange={(e) =>
                      setLocalNode({
                        ...localNode,
                        conditions: e.target.value as 'AND' | 'OR',
                      })
                    }
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </label>

                {/* {(localNode.conditions || []).map((cond, condIndex) => (
                  <div key={condIndex} className="mt-2 flex items-center gap-2">
                    <input
                      placeholder="field"
                      className="w-20 rounded border px-2 py-1"
                      value={cond.field}
                      onChange={(e) => {
                        const updatedCond = { ...cond, field: e.target.value };
                        updateCondition(condIndex, updatedCond);
                      }}
                    />
                    <select
                      className="rounded border px-2 py-1"
                      value={cond.operator}
                      onChange={(e) => {
                        const updatedCond = {
                          ...cond,
                          operator: e.target.value as Condition['operator'],
                        };
                        updateCondition(condIndex, updatedCond);
                      }}
                    >
                      <option value="==">==</option>
                      <option value="!=">!=</option>
                      <option value=">">{'>'}</option>
                      <option value="<">{'<'}</option>
                      <option value="contains">contains</option>
                    </select>
                    <input
                      placeholder="value"
                      className="w-24 rounded border px-2 py-1"
                      value={cond.value}
                      onChange={(e) => {
                        const updatedCond = { ...cond, value: e.target.value };
                        updateCondition(condIndex, updatedCond);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => removeCondition(condIndex)}
                    >
                      X
                    </Button>
                  </div>
                ))} */}

                <Button variant="outline" size="sm" className="mt-2" onClick={addCondition}>
                  Добавить условие
                </Button>
              </div>
            )}

            {/* Описание шага */}
            <label className="flex flex-col text-sm">
              Описание шага
              <textarea
                className="mt-1 rounded border px-2 py-1"
                value={localNode.description || ''}
                onChange={(e) =>
                  setLocalNode((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
              />
            </label>

            <Button
              onClick={() => {
                onSave(localNode);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Сохранить
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Удалить шаг
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Модальное окно для редактирования скрипта */}
      <Dialog open={isScriptModalOpen} onOpenChange={setIsScriptModalOpen}>
        <DialogContent className="max-w-fit">
          <DialogHeader>
            <DialogTitle>Редактировать скрипт</DialogTitle>
            <DialogDescription>Напишите ваш JavaScript код здесь.</DialogDescription>
          </DialogHeader>
          <div className="h-[500px] w-[600px] overflow-auto rounded-md">
            <AutamationScriptEditor
              script={localNode.description ?? '// Ваш код'} // Передаем текущий скрипт
              onScriptChange={handleScriptChange} // Передаем функцию обновления
            />
          </div>
          <Button onClick={() => setIsScriptModalOpen(false)}>Закрыть</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
