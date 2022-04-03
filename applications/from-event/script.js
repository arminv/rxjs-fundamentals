import { fromEvent } from 'rxjs';

const button = document.getElementById('create-notification');
const notificationMessages = document.getElementById('notification-messages');

const createNotificationElement = () => {
  const element = document.createElement('article');
  element.innerText = 'Something happened.';
  return element;
};

const addMessageToDOM = () => {
  const notification = createNotificationElement();
  notificationMessages.appendChild(notification);
};

/**
 * Your mission:
 *
 * - Use `fromEvent` to create an observable that streams click events.
 * - Subscribe to that observable.
 * - Use `addMessageToDOM` to add a useless message to the DOM whenever the
 *   stream emits a value.
 */

// NOTE: unlike with event listeners, `fromEvent` helps us clean up at the end
// so there is no need to remove anything!
const buttonClick$ = fromEvent(button, 'click');

buttonClick$.subscribe(addMessageToDOM);
buttonClick$.subscribe(() => alert('You clicked the button!!!!'));
