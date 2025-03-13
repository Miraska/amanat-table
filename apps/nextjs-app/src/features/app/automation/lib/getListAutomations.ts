import axios from 'axios';
import type { IAutomation } from '../types';

export default async function getListAutomations(): Promise<IAutomation[]> {
  try {
    // Выполняем запрос на получение списка автоматизации и вовзращаем массив автоматизаций
    const response = await axios.get('https://cswrljhh-3000.euw.devtunnels.ms/automations');
    return response.data as IAutomation[];
  } catch (error) {
    // Выводим ошибку в консоль и возвращаем пустой массив
    console.error('Error fetching data:', error);
    return [];
  }
}
