export const Rect = function(rect){
    this.x = rect.x || 0;
    this.y = rect.y || 0;
    this.width = rect.width || 50;
    this.height = rect.height || 50;

    return{
        x:this.x,
        y:this.y,
        width:this.width,
        height:this.height,
    }
    
}
