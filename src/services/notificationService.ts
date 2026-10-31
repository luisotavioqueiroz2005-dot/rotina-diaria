// Web Notification API Service for ADHD Routine & Deadline Alerts

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Este navegador não suporta a Web Notification API.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function isNotificationSupportedAndGranted(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

export function sendWebNotification(title: string, options?: NotificationOptions) {
  if (!isNotificationSupportedAndGranted()) {
    console.log('Notificação web ignorada (permissão não concedida):', title);
    return;
  }

  try {
    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'dopamine-hacker-alert',
      ...options,
    };

    const notification = new Notification(title, defaultOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (err) {
    console.error('Erro ao emitir Web Notification:', err);
  }
}

export function notifyPendingMandatoryTasks(count: number) {
  sendWebNotification('⚠️ Alerta TDAH: Compromisso Obrigatório Pendente!', {
    body: `Você possui ${count} ${count === 1 ? 'tarefa obrigatória pendente' : 'tarefas obrigatórias pendentes'} para hoje. A loja de recompensas está bloqueada!`,
    tag: 'mandatory-task-alert',
  });
}

export function notifyRoutineCheckinReminder(routineTitle: string, rewardValue: number) {
  sendWebNotification(`⚡ Check-in Pendente: ${routineTitle}`, {
    body: `Conclua agora para creditar +R$ ${rewardValue.toFixed(2)} no seu saldo virtual!`,
    tag: 'routine-checkin-alert',
  });
}

export function notifyTaskCompletedSuccess(taskTitle: string, totalEarned: number) {
  sendWebNotification(`🎉 Parabéns! Mission Complete!`, {
    body: `Você concluiu "${taskTitle}" e resgatou +R$ ${totalEarned.toFixed(2)} virtuais.`,
    tag: 'task-completed-alert',
  });
}
