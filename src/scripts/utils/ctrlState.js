/**
 * @module ctrlState
 * @desc state container for controllers
 */

export default function CtrlState() {
  this.drawFunc = null;
  this.observerFunc = null;
  this.observers = [];
}
