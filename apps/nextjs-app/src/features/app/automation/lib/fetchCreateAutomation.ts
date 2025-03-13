import axios from 'axios';
import type { INewAutomation } from '../types';

export default async function fetchCreateAutomation(newAutomation: INewAutomation) {
  // Формируем payload согласно примеру
  const payload = {
    name: newAutomation.name,
    triggerType: newAutomation.triggerType,
    enabled: newAutomation.enabled,
  };

  // Выполняем POST-запрос на сервер
  const response = await axios.post('https://cswrljhh-3000.euw.devtunnels.ms/automations', payload);
  return response.data;
}
