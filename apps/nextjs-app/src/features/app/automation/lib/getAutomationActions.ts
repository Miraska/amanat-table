import axios from 'axios';
import type { IAction } from '../types';

export default async function getAutomationAcions(automationId: string): Promise<IAction[]> {
  try {
    // Выполняем запрос на получение списка действий для автоматизации по id автоматизации
    const url = `https://cswrljhh-3000.euw.devtunnels.ms/automations/${automationId}/actions`;

    // Формируем ответ и возвращаем его
    const response = await axios.get(url);
    return response.data as IAction[];
  } catch (error) {
    // Выводим ошибку в консоль и возвращаем пустой массив
    console.error(`Error fetching flow nodes for automation ${automationId}:`, error);
    return [];
  }
}
