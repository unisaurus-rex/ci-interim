export default function Panel(){
  this.cboxes = null;
  this.chartConfig = null;
  this.data = null;
  this.drawFunc = null;
  this.dropdown = null;
  this.observerFunc = null;
  this.observers = null;
  this.resetCount = 0;
  this.svg = {
    width: 0,
    height: 0,
    margins: { top: 0, left: 0, right:0, bottom: 0 }
  }
}
