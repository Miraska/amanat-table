import axios from 'axios';

export default async function fetchToggleAutomation(automationId: string, newState: boolean) {
  // Выполняем запрос на переключение статуса автоматизации
  await axios.patch(`https://cswrljhh-3000.euw.devtunnels.ms/automations/${automationId}/toggle`, {
    enabled: newState,
  });
}
