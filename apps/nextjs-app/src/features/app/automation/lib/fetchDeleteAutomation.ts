import axios from 'axios';

export default async function fetchDeleteAutomation(automationId: string) {
  // Выполняем DELETE-запрос по адресу с id автоматизации
  await axios.delete(`https://cswrljhh-3000.euw.devtunnels.ms/automations/${automationId}`);
}
