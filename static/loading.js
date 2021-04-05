window.onload = function(){
    var loader = this.document.getElementById('loader');
    
    this.setTimeout(
        function(){
            loader.classList.add('fadeout')
        },500
    );
    
    
    this.loader.ontransitionend = function(){
        loader.classList.add('is_hide')
    };
    
}

