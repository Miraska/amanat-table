// import { Alert, AlertTitle, AlertDescription } from '@teable/ui-lib/shadcn/ui/alert';
// import { Button } from '@teable/ui-lib/shadcn/ui/button';
// import { Switch } from '@teable/ui-lib/shadcn/ui/switch';
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// import { AddAutomationSheet } from './components/AddAutomationSheet';
// import { AutomationDetailsSheet } from './components/AutomationDetailsSheet';
// import { AutomationFlow } from './components/AutomationFlow';
// import { AutomationHistory } from './components/AutomationHistory';
// import { AutomationList } from './components/AutomationList';
// import { NodeDetailsSheet } from './components/NodeDetailsSheet';
// import type { Automation, FlowNode, AutomationRunLog } from './types';

// // Простая кеширующая переменная для автоматизаций
// let cachedAutomations: Automation[] | null = null;

// export function AutomationPage() {
//   // Получение списка автоматизаций с сервера
//   async function getListAutomations(): Promise<Automation[]> {
//     try {
//       const response = await axios.get('https://cswrljhh-3000.euw.devtunnels.ms/automations');
//       console.log('Response data:', response.data);
//       return (response.data as any[]).map(transformAutomation);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       return [];
//     }
//   }

//   // Преобразование "сырого" объекта автоматизации в тип Automation
//   function transformAutomation(raw: any): Automation {
//     return {
//       id: raw.id,
//       name: raw.name,
//       description: raw.name || '',
//       enabled: raw.enabled,
//       triggerType: raw.triggerType,
//       triggerConfig: raw.triggerConfig,
//       flow: [],
//     };
//   }

//   // Преобразование "сырого" объекта flow node в тип FlowNode
//   function transformFlowNode(raw: any): FlowNode {
//     let mappedType: 'trigger' | 'logic' | 'action' | 'script';
//     let title = '';

//     switch (raw.type) {
//       case 'runScript':
//         mappedType = 'script';
//         title = 'Script';
//         break;
//       default:
//         mappedType = 'action';
//         title = raw.type;
//         break;
//     }

//     const node: FlowNode = {
//       id: raw.id,
//       title,
//       type: mappedType,
//     };

//     if (mappedType === 'script' && raw.params && raw.params.script) {
//       node.script = raw.params.script;
//     }

//     return node;
//   }

//   // Получение flow nodes для конкретной автоматизации
//   async function getFlowNodes(automationId: string): Promise<FlowNode[]> {
//     try {
//       const url = `https://cswrljhh-3000.euw.devtunnels.ms/automations/${automationId}/actions`;
//       const response = await axios.get(url);
//       console.log(`Flow nodes for automation ${automationId}:`, response.data);
//       return (response.data as any[]).map(transformFlowNode);
//     } catch (error) {
//       console.error(`Error fetching flow nodes for automation ${automationId}:`, error);
//       return [];
//     }
//   }

//   // Состояния компонента
//   const [automations, setAutomations] = useState<Automation[]>([]);
//   const [runLogs, setRunLogs] = useState<AutomationRunLog[]>([]);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
//   const [isNodeSheetOpen, setIsNodeSheetOpen] = useState(false);
//   const [isAddAutomationSheetOpen, setIsAddAutomationSheetOpen] = useState(false);
//   const [isAutomationDetailsSheetOpen, setIsAutomationDetailsSheetOpen] = useState(false);
//   const [viewMode, setViewMode] = useState<'flow' | 'history'>('flow');

//   const selectedAutomation = automations.find((a) => a.id === selectedId) || null;

//   // Загрузка автоматизаций и их flow nodes
//   useEffect(() => {
//     async function fetchData() {
//       if (cachedAutomations) {
//         setAutomations(cachedAutomations);
//         if (!selectedId && cachedAutomations.length > 0) {
//           setSelectedId(cachedAutomations[0].id);
//         }
//       } else {
//         const list = await getListAutomations();
//         const updatedList = await Promise.all(
//           list.map(async (automation) => {
//             automation.flow = await getFlowNodes(automation.id);
//             return automation;
//           })
//         );
//         cachedAutomations = updatedList;
//         setAutomations(updatedList);
//         if (!selectedId && updatedList.length > 0) {
//           setSelectedId(updatedList[0].id);
//         }
//       }
//     }
//     fetchData();
//   }, []);

//   // Переключение статуса автоматизации
//   const toggleAutomation = (automationId: string) => {
//     setAutomations((prev) =>
//       prev.map((item) => (item.id === automationId ? { ...item, enabled: !item.enabled } : item))
//     );
//   };

//   const debug = () => {
//     console.log(automations);
//   };

//   // Удаление автоматизации
//   const handleDeleteAutomation = async (automationId: string) => {
//     try {
//       // Выполняем DELETE-запрос по адресу с id автоматизации
//       await axios.delete(`https://cswrljhh-3000.euw.devtunnels.ms/automations/${automationId}`);
//       console.log(`Automation ${automationId} deleted successfully.`);

//       // Обновляем состояние: удаляем автоматизацию из списка
//       const newAutomations = automations.filter((a) => a.id !== automationId);
//       setAutomations(newAutomations);
//       if (selectedId === automationId) {
//         setSelectedId(newAutomations[0]?.id ?? null);
//       }

//       // Обновляем кеш
//       cachedAutomations = newAutomations;
//     } catch (error) {
//       console.error(`Error deleting automation ${automationId}:`, error);
//     }
//   };

//   // Дублирование автоматизации
//   const handleDuplicateAutomation = (automationId: string) => {
//     const original = automations.find((a) => a.id === automationId);
//     if (!original) return;
//     const newId = String(Date.now());
//     const cloned = {
//       ...original,
//       id: newId,
//       name: original.name + ' (копия)',
//       flow: original.flow?.map((n) => ({ ...n, id: String(Date.now() + Math.random()) })),
//     };
//     setAutomations((prev) => [...prev, cloned]);
//     setSelectedId(newId);
//   };

//   // Открыть форму для создания новой автоматизации
//   const handleOpenAddAutomation = () => {
//     setIsAddAutomationSheetOpen(true);
//   };

//   // Сохранение новой автоматизации с POST-запросом
//   const handleSaveNewAutomation = async (newAutomation: Automation) => {
//     try {
//       // Формируем payload согласно примеру
//       const payload = {
//         name: newAutomation.name,
//         triggerType: newAutomation.triggerType,
//         enabled: newAutomation.enabled,
//       };

//       // Выполняем POST-запрос на сервер
//       const response = await axios.post(
//         'https://cswrljhh-3000.euw.devtunnels.ms/automations',
//         payload
//       );
//       console.log('New automation saved:', response.data);

//       // Предполагаем, что сервер возвращает объект с полем id
//       const createdAutomation: Automation = {
//         ...newAutomation,
//         id: response.data.id, // id из ответа сервера
//         flow: [],
//       };

//       // Обновляем состояние и кеш
//       const updatedAutomations = [...automations, createdAutomation];
//       setAutomations(updatedAutomations);
//       cachedAutomations = updatedAutomations;
//       setIsAddAutomationSheetOpen(false);
//       setSelectedId(createdAutomation.id);
//     } catch (error) {
//       console.error('Error saving new automation:', error);
//     }
//   };

//   // Обработка клика по узлу (FlowNode)
//   const handleNodeClick = (node: FlowNode) => {
//     setSelectedNode(node);
//     setIsNodeSheetOpen(true);
//   };

//   // Сохранение изменений узла
//   const handleSaveNode = (updatedNode: FlowNode) => {
//     if (!selectedAutomation) return;
//     setAutomations((prev) =>
//       prev.map((automation) => {
//         if (automation.id !== selectedAutomation.id) return automation;
//         if (!automation.flow) return automation;
//         const newFlow = automation.flow.map((node) =>
//           node.id === updatedNode.id ? { ...updatedNode } : node
//         );
//         return { ...automation, flow: newFlow };
//       })
//     );
//     setIsNodeSheetOpen(false);
//     setSelectedNode(null);
//   };

//   // Добавление нового шага (узла) в выбранную автоматизацию
//   const handleAddNewStep = () => {
//     if (!selectedAutomation) return;
//     const newId = String(Date.now());
//     const newNode: FlowNode = {
//       id: newId,
//       title: `Новое действие #${newId}`,
//       type: 'action',
//     };
//     setAutomations((prev) =>
//       prev.map((automation) => {
//         if (automation.id !== selectedAutomation.id) return automation;
//         const newFlow = automation.flow ? [...automation.flow, newNode] : [newNode];
//         return { ...automation, flow: newFlow };
//       })
//     );
//   };

//   // Удаление выбранного шага
//   const handleDeleteStep = () => {
//     if (!selectedAutomation || !selectedNode) return;
//     setAutomations((prev) =>
//       prev.map((automation) => {
//         if (automation.id !== selectedAutomation.id) return automation;
//         if (!automation.flow) return automation;
//         return {
//           ...automation,
//           flow: automation.flow.filter((node) => node.id !== selectedNode.id),
//         };
//       })
//     );
//     setSelectedNode(null);
//     setIsNodeSheetOpen(false);
//   };

//   // Обработка сортировки (drag-and-drop)
//   const handleReorderNodes = (sourceIndex: number, targetIndex: number) => {
//     if (!selectedAutomation) return;
//     setAutomations((prev) =>
//       prev.map((automation) => {
//         if (automation.id !== selectedAutomation.id) return automation;
//         if (!automation.flow) return automation;
//         const newFlow = [...automation.flow];
//         const [moved] = newFlow.splice(sourceIndex, 1);
//         newFlow.splice(targetIndex, 0, moved);
//         return { ...automation, flow: newFlow };
//       })
//     );
//   };

//   // Переключение между режимами просмотра Flow и History
//   const handleToggleHistory = () => {
//     setViewMode(viewMode === 'flow' ? 'history' : 'flow');
//   };

//   // «Ручной запуск» автоматизации (Test run)
//   const handleTestAutomation = () => {
//     if (!selectedAutomation) return;
//     const runId = Date.now();
//     const newLog: AutomationRunLog = {
//       id: runId,
//       automationId: selectedAutomation.id,
//       startedAt: new Date(),
//       status: 'running',
//     };
//     setRunLogs((prev) => [...prev, newLog]);

//     // Имитация прохождения шагов
//     setTimeout(() => {
//       setRunLogs((prev) =>
//         prev.map((log) =>
//           log.id === runId
//             ? {
//                 ...log,
//                 finishedAt: new Date(),
//                 status: 'success',
//                 message: 'Test run completed successfully',
//               }
//             : log
//         )
//       );
//     }, 1500);
//   };

//   // Обновление автоматизации (todo)
//   const handleSaveAutomationDetails = async (updatedAutomation: Automation) => {
//     try {
//       // Маппим flow (FlowNode[]) в actions, понятные бэкенду
//       const actions = updatedAutomation.flow?.map((node, index) => {
//         // Определяем тип для сервера
//         let serverType: string;
//         switch (node.type) {
//           case 'script':
//             serverType = 'runScript';
//             break;
//           // Если есть другие варианты, добавьте их сюда
//           default:
//             serverType = node.type; // или 'callWebhook', 'sendEmail' и т.д., если нужно
//             break;
//         }

//         return {
//           type: serverType,
//           params: node.script ? { script: node.script } : {},
//           order: index + 1, // или используйте node.order, если у вас есть порядок в FlowNode
//         };
//       });

//       // Формируем payload
//       const payload = {
//         name: updatedAutomation.name,
//         enabled: updatedAutomation.enabled,
//         triggerType: updatedAutomation.triggerType,
//         triggerConfig: updatedAutomation.triggerConfig,
//         // Передаём actions, если они есть
//         actions: actions || [],
//       };

//       // Выполняем PATCH-запрос на /automations/:id
//       const response = await axios.patch(
//         `https://cswrljhh-3000.euw.devtunnels.ms/automations/${updatedAutomation.id}`,
//         payload
//       );

//       // Предполагаем, что сервер возвращает обновлённую автоматизацию в response.data
//       const updatedFromServer = response.data;

//       // Обновляем локальный список автоматизаций
//       const newAutomations = automations.map((automation) =>
//         automation.id === updatedAutomation.id
//           ? { ...automation, ...updatedFromServer }
//           : automation
//       );

//       setAutomations(newAutomations);
//       // Если используете кеш (cachedAutomations), обновите и его:
//       // cachedAutomations = newAutomations;

//       // Закрываем sheet
//       setIsAutomationDetailsSheetOpen(false);
//     } catch (error) {
//       console.error('Error updating automation:', error);
//     }
//   };

//   return (
//     <div className="flex h-screen flex-col">
//       {/* Шапка */}
//       <div className="flex items-center justify-between border-b px-6 py-4">
//         <div className="flex items-center gap-4">
//           <h2 className="text-xl font-bold">
//             {selectedAutomation?.name ?? 'Выберите автоматизацию'}
//           </h2>
//           {selectedAutomation && (
//             <Switch
//               checked={selectedAutomation.enabled}
//               onCheckedChange={() => toggleAutomation(selectedAutomation.id)}
//             />
//           )}
//           <Button onClick={debug}>Дебаг</Button>
//         </div>
//         <div className="flex items-center gap-2">
//           {selectedAutomation && (
//             <>
//               <Button
//                 variant={viewMode === 'history' ? 'default' : 'outline'}
//                 onClick={handleToggleHistory}
//               >
//                 Посмотреть историю
//               </Button>
//               <Button variant="outline" onClick={handleTestAutomation}>
//                 Тест автоматизаций
//               </Button>
//               <Button variant="outline" onClick={() => setIsAutomationDetailsSheetOpen(true)}>
//                 Редактировать
//               </Button>
//               <Button onClick={handleAddNewStep}>Добавить шаг</Button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Основной контент */}
//       <div className="flex flex-1 overflow-hidden">
//         <AutomationList
//           automations={automations}
//           selectedId={selectedId}
//           onSelect={setSelectedId}
//           onToggle={toggleAutomation}
//           onDelete={handleDeleteAutomation}
//           onDuplicate={handleDuplicateAutomation}
//           handleOpenAddAutomation={handleOpenAddAutomation}
//         />

//         <div className="relative flex-1">
//           {selectedAutomation ? (
//             viewMode === 'flow' ? (
//               <DndProvider backend={HTML5Backend}>
//                 <AutomationFlow
//                   flow={selectedAutomation.flow}
//                   onNodeClick={handleNodeClick}
//                   onReorder={handleReorderNodes}
//                   onAddStep={handleAddNewStep}
//                 />
//               </DndProvider>
//             ) : (
//               <AutomationHistory logs={runLogs} automationId={selectedAutomation.id} />
//             )
//           ) : (
//             <div className="flex h-full items-center justify-center">
//               <Alert className="flex w-[400px] flex-col items-center gap-3">
//                 <AlertTitle className="text-base">Создайте новую автоматизацию</AlertTitle>
//                 <AlertDescription>
//                   <Button onClick={handleOpenAddAutomation}>Создать автоматизацию</Button>
//                 </AlertDescription>
//               </Alert>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Редактирование узла */}
//       <NodeDetailsSheet
//         open={isNodeSheetOpen}
//         node={selectedNode}
//         onClose={setIsNodeSheetOpen}
//         onDelete={handleDeleteStep}
//         onSave={handleSaveNode}
//       />

//       {/* Создание новой автоматизации */}
//       <AddAutomationSheet
//         open={isAddAutomationSheetOpen}
//         onClose={setIsAddAutomationSheetOpen}
//         onSave={handleSaveNewAutomation}
//       />

//       {/* Редактирование автоматизации */}
//       <AutomationDetailsSheet
//         open={isAutomationDetailsSheetOpen}
//         automation={selectedAutomation}
//         onClose={setIsAutomationDetailsSheetOpen}
//         onSave={handleSaveAutomationDetails}
//       />
//     </div>
//   );
// }
