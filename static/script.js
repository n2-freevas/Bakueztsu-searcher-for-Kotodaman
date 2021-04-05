const list_items = document.getElementsByClassName("word");
const empty_lists = document.getElementsByClassName("empty");
const banmen_lists = document.getElementsByClassName("banmen");
const fifty_lists = document.getElementsByClassName("fifty");
const changable_lists = document.getElementsByClassName("changable");

function changable_word_change(cw){
    let dakuten_bool = cw.classList.contains("dakuten");
    let handakuten_bool = cw.classList.contains("handakuten");
    let small_bool = cw.classList.contains("small");

    let img_src = cw.getAttribute("src");
    //img_src = img_src.substr(12);
    img_src = img_src.substr(11);
    console.log(img_src);
    img_src = img_src.slice(0, -4);
    console.log(img_src);

    if(dakuten_bool){
        img_src = "static/img/"+ String((Number(img_src)+50)%100) +".svg";
        cw.setAttribute("src", img_src);

        if(cw.getAttribute("alt").normalize('NFD').length == 1){ //濁点でないとき，濁点を付けてaltを書き換える
            let after_word = unescape(escape(cw.getAttribute("alt").normalize("NFD")[0]) + "%u3099");
            cw.removeAttribute("alt");
            cw.setAttribute("alt", after_word);
        }
        else{ //濁点の時，濁点を外してaltを書き換える．
            let after_word = cw.getAttribute("alt").normalize("NFD")[0];
            cw.removeAttribute("alt");
            cw.setAttribute("alt", after_word);
        }
    }

    else if(handakuten_bool){
        let img_src_num = img_src;
        img_src = "static/img/"+ String((Number(img_src)+50)%150) +".svg";
        cw.setAttribute("src", img_src);

        if(img_src_num == 17){
            cw.removeAttribute("alt");
            cw.setAttribute("alt", "づ");
        }

        else if(img_src_num == 67){
            cw.removeAttribute("alt");
            cw.setAttribute("alt", "っ");
        }

        else if(img_src_num == 117) {
            cw.removeAttribute("alt");
            cw.setAttribute("alt", "つ");
        }

        else{
            let uni_num_x16 = escape(cw.getAttribute("alt").normalize("NFC")[0]).substr(2, 4);
            let uni_num = Number(parseInt(uni_num_x16, 16));

            if((uni_num % 3 == 0)||( uni_num % 3 == 1)){
                uni_num++;
                after_word = unescape("%u" + uni_num.toString(16));
                cw.removeAttribute("alt");
                cw.setAttribute("alt", after_word);
            }

            else{
                uni_num = uni_num - 2;
                after_word = unescape("%u" + uni_num.toString(16));
                cw.removeAttribute("alt");
                cw.setAttribute("alt", after_word);
            }
        }
    }

    else if(small_bool){
        img_src = "static/img/"+ String((Number(img_src)+150)%300) +".svg";
        cw.setAttribute("src", img_src);

        let uni_num = escape(cw.getAttribute("alt").normalize("NFD")[0]).substr(2, 4);
        if(Number(uni_num) % 2 == 0){
            let after_word = unescape("%u" + String(Number(uni_num) - 1));
            cw.removeAttribute("alt");
            cw.setAttribute("alt", after_word);
        }

        else{
            let after_word = unescape("%u" + String(Number(uni_num) + 1));
            cw.removeAttribute("alt");
            cw.setAttribute("alt", after_word);
        }
    }
}


let draggedItem = null;
let predrag = null;
//touch device functions
for (let i = 0; i < list_items.length; i++){
    const item = list_items[i];
    //*common function for mouse device and touch device
    item.addEventListener("dragstart", function(){
        draggedItem = item
        predrag = item.parentElement

    });

    item.addEventListener("dragend", function(){
        setTimeout( function(){
            draggedItem = null;
            predrag = null;
        }, 100);
    });

    if(item.classList.contains('changable')){
        item.addEventListener('touchstart',function(e){
            let endMode = false;
            e.preventDefault();
            draggedItem = item.cloneNode(true);
            predrag = item.parentElement;

            //touchstart -> touchmoveと判定された場合は，文字移動シーケンスと判定し，ひらがなパーツを握持する．
            item.addEventListener('touchmove',function Changable_Move(e){
                endMode = true;
                event.preventDefault();

                //タッチ中は常に指の絶対座標情報を取得する．
                var touchInfo = e.changedTouches[0];
                // タッチデバイスでひらがなパーツを握持している時，指の位置にパーツが追従するよう振舞う関数群(1)-(3)
                //(1)position fixed により，パーツがユーザデバイスの画面幅(x)，画面高さ(y)に対する絶対座標で位置指定される
                e.target.style.position = 'fixed';
                e.target.style.zIndex = '5000';
                //(2)(3)(top,left)が絶対座標に該当する．touchInfoから得られる指の位置やユーザデバイスの画面サイズに応じて座標をひらがなパーツの位置を変更する．
                e.target.style.top = (touchInfo.pageY - window.pageYOffset - 50 / 2) + "px";
                e.target.style.left = (touchInfo.pageX - window.pageXOffset - 50 / 2) + "px";


            //item.removeEventListener('touchend',Changable_Move)
            });

            //touchstart -> touchendと判定されt場合は，濁点小文字変換処理を行うのが以下のeventListner
            item.addEventListener('touchend',function changable_touchend(e){
                e.preventDefault();
                if(endMode){
                    e.preventDefault();
                    // 絶対座標で指定されたスタイルをリセットする．
                    e.target.style.position = '';
                    e.target.style.top = '';
                    e.target.style.left = '';
                    //指を話した位置に最も近い要素にドロップさせる．
                    var touch = event.changedTouches[0];
                    var newParentElem = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
                    // banmenクラスを持つ7つの穴を感知した場合，appendChildによりドロップする．
                    if (newParentElem.classList.contains("empty")) {
                        draggedItem.classList.add('input');
                        newParentElem.appendChild(draggedItem);
                    }

                }
                else{
                    window.setTimeout(function(){
                        changable_word_change(item);
                    },100)
                }
                item.removeEventListener('touchend',changable_touchend)
            });


        });
    }

    else{
        item.addEventListener('touchstart',function(e){
            e.preventDefault();
            draggedItem = item.cloneNode(true);
            predrag = item.parentElement;
        });
        item.addEventListener('touchmove',function(e){
            event.preventDefault();
            //タッチ中は常に指の絶対座標情報を取得する．
            var touchInfo = e.changedTouches[0];
            // タッチデバイスでひらがなパーツを握持している時，指の位置にパーツが追従するよう振舞う関数群(1)-(3)
            //(1)position fixed により，パーツがユーザデバイスの画面幅(x)，画面高さ(y)に対する絶対座標で位置指定される
            e.target.style.position = 'fixed';
            //(2)(3)(top,left)が絶対座標に該当する．touchInfoから得られる指の位置やユーザデバイスの画面サイズに応じて座標をひらがなパーツの位置を変更する．
            e.target.style.top = (touchInfo.pageY - window.pageYOffset - 50 / 2) + "px";
            e.target.style.left = (touchInfo.pageX - window.pageXOffset - 50 / 2) + "px";
        });
        item.addEventListener('touchend',function(e){
            e.preventDefault();
            // 絶対座標で指定されたスタイルをリセットする．
            e.target.style.position = '';
            e.target.style.top = '';
            e.target.style.left = '';
            //指を話した位置に最も近い要素にドロップさせる．
            var touch = event.changedTouches[0];
            var newParentElem = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
            // banmenクラスを持つ7つの穴を感知した場合，appendChildによりドロップする．
            if (newParentElem.classList.contains("empty")) {
                draggedItem.classList.add('input');
                newParentElem.appendChild(draggedItem);
            }
            setTimeout( function(){
                draggedItem = null;
                predrag = null;
            },100);
        });
    }
}

//mouse device functions
for(let j = 0; j < empty_lists.length; j++){
    const empty_list = empty_lists[j];

    empty_list.addEventListener("dragover", function(e){
        e.preventDefault();

    });
    empty_list.addEventListener("dragenter", function(e){
        e.preventDefault();
        this.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    });

    empty_list.addEventListener("dragleave", function(e){
        e.preventDefault();
        this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    });

    empty_list.addEventListener("drop", function(e){
        e.preventDefault();
        this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        copy = draggedItem.cloneNode(true);
        copy.classList.add("input");
        if(this.firstElementChild != null){
            this.textContent = null;
        }
        this.append(copy);
        predrag.append(draggedItem);
    });

    empty_list.addEventListener("click", function(e){
        e.preventDefault();
        this.textContent = null;
    });

    empty_list.addEventListener("touchstart", function(e){
        e.preventDefault();
        this.textContent = null;
    })
}
for(let m = 0; m < changable_lists.length; m++){
    const changable_list = changable_lists[m];


    changable_list.addEventListener("click", function(e){
        e.preventDefault();
        changable_word_change(changable_list);
    });
}


//-----------------------------------------------------------------------------------------------------------------
document.getElementById("resetbutton").onclick = function(){

    const reseted_Elements = document.getElementsByClassName("empty");
    for(let n = 0; n < reseted_Elements.length; n++){
        reseted_Elements[n].textContent = null;
    }
};

//----------------------------------------------------------------------
$(function(){
    $(".headC").click(function(){
        $(".headB").slideToggle();
    });
});
