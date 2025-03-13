// root/apps/next-js/src/features/app/automation/types.ts

// Интерфейс созданных автоматизаций
export interface IAutomation extends INewAutomation {
  id: string;
}

// Интерфейс новых автоматизации. Нужен для типизации автоматизаций без поля id
export interface INewAutomation {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conditions?: any;
  createdBy?: string;
  enabled: boolean;
  tableId?: string;
  tableIdOrName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  triggerConfig?: any;
  triggerDescription?: string;
  triggerLabel?: string;
  triggerType: string;
  actions?: IAction[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watchFields?: any;
  updatedTime?: string;
  createdTime?: string;
}

// Интерфейс новых действий для автоматизаций. Нужен для типизации действий автоматизаций без поля id
export interface INewAction {
  automationId: string;
  order: number;
  type: 'runScript' | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conditions?: any;
  updatedTime?: string;
  createdTime?: string;
  label?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputVars?: any;
}

// Интерфейс созданных действий
export interface IAction extends INewAction {
  id: string;
}

// Интерфейс конфигурации триггера
export interface ITriggerConfig {}

// Определяем интерфейс для условий (здесь можно расширять по необходимости)
export interface Condition {
  // Пример: тип условия, оператор, значение и т.д.
  field?: string;
  operator?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

// // Для хранения истории запусков
export interface AutomationRunLog {
  id: number;
  automationId: string;
  startedAt: Date;
  finishedAt?: Date;
  status: 'success' | 'fail' | 'running';
  message?: string;
}
