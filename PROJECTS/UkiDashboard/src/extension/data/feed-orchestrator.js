import { generateNewsItem } from './source-clients/news-client.js';
import { generateEventItem } from './source-clients/events-client.js';
import { generateDroneItem } from './source-clients/drone-client.js';
import { createReconnectPolicy } from '../runtime/reconnect-policy.js';

export function createFeedOrchestrator(onItem, onSourceFailure, onSourceRecovery) {
  let running = false;
  let newsTimer = null;
  let eventTimer = null;
  let droneTimer = null;
  const reconnectPolicy = createReconnectPolicy();

  function scheduleRecovery(sourceId, emitFn) {
    const delay = reconnectPolicy.nextDelay(sourceId);
    setTimeout(() => {
      if (!running) return;
      onSourceRecovery(sourceId, delay);
      emitFn();
    }, delay);
  }

  function emitNews() {
    if (!running) return;
    if (Math.random() < 0.08) {
      onSourceFailure('news:Kyiv Wire');
      scheduleRecovery('news:Kyiv Wire', emitNews);
      return;
    }
    reconnectPolicy.reset('news:Kyiv Wire');
    onItem(generateNewsItem());
  }

  function emitEvent() {
    if (!running) return;
    if (Math.random() < 0.08) {
      onSourceFailure('events:Ops Bulletin');
      scheduleRecovery('events:Ops Bulletin', emitEvent);
      return;
    }
    reconnectPolicy.reset('events:Ops Bulletin');
    onItem(generateEventItem());
  }

  function emitDrone() {
    if (!running) return;
    if (Math.random() < 0.1) {
      onSourceFailure('drone:Sky Sentinel');
      scheduleRecovery('drone:Sky Sentinel', emitDrone);
      return;
    }
    reconnectPolicy.reset('drone:Sky Sentinel');
    onItem(generateDroneItem());
  }

  return {
    start() {
      if (running) return;
      running = true;
      emitNews();
      emitEvent();
      emitDrone();
      newsTimer = setInterval(emitNews, 3500);
      eventTimer = setInterval(emitEvent, 4200);
      droneTimer = setInterval(emitDrone, 5000);
    },
    stop() {
      running = false;
      clearInterval(newsTimer);
      clearInterval(eventTimer);
      clearInterval(droneTimer);
      newsTimer = null;
      eventTimer = null;
      droneTimer = null;
    },
    isRunning() {
      return running;
    }
  };
}
