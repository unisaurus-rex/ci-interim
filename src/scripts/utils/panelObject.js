export default function Panel(){
	this.dropdown = null;
	this.cboxes = null;
	this.resetCount = 0;
	this.observerFunc = null;
	this.observers = null;
	this.data = null;
	this.drawFunc = null;
	this.location = null; 
	this.svg = {
		width: 0,
		height: 0,
		margins: { top: 0, left: 0, right:0, bottom: 0 }
	}
}
