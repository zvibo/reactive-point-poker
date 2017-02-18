import w from 'window';
import domChanger from 'domchanger';
import RoomView from '../views/RoomView';

export default changes => {
	// init domChanger
	const root = new RoomView(changes);
	domChanger(root.component, w.document.body).update();
	return root.events;
};
