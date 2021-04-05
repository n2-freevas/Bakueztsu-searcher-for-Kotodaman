const result_lists = document.getElementsByClassName("banmen");
const priority_word_lists = document.getElementsByClassName("priority_word");
let result_words = ["", "", "", "", "", "", ""];
document.getElementById("searchbutton").onclick = function(){

    //　(1) banmenから，盤面情報を採取する．
    for(let p = 0; p < result_lists.length; p++){
        if(result_lists[p].firstElementChild == null){
            //console.log(result_lists[p].firstElementChild);
            result_words[p] = ".";
        }
        else{
            //console.log(result_lists[p].firstElementChild);
            result_words[p] = result_lists[p].firstChild.getAttribute("alt");
        }
    }
    let result = result_words.join("");
    console.log(result);
    //　(1) end

    // (2) priorityから，優先操作単語を2つまで採取する．
    var priority_word_array = new Array()
    for(let p = 0; p < priority_word_lists.length; p++){
        pri = priority_word_lists[p]
        if(pri.firstElementChild != null){
            priority_word_array.push(pri.firstChild.getAttribute('alt'))
        }
    }
    console.log(priority_word_array)
    // (2) end

    // (3) 盤面に空白が4つあるか確認
    for(q = 0, dotcounter = 0; q < result_words.length; q++){
        if(result_words[q] === "."){
            dotcounter++;
            console.log
        } 
    }
    // (3) end
    if(dotcounter != 4){alert("当てはめる文字数は3つのみにしてください");}
    else{
        try{
            var fData = new FormData();
            fData.append('banmen',result);
            fData.append('priority',priority_word_array)
            $.ajax({
                url: '/register',
                type: 'POST',
                data: fData,
                contentType: false,
                processData: false,
                success: function(data, dataType){
                    console.log('Success',data)
                    $('#result').html(data);
                    resultShow();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('Error : '+errorThrown)
                }
            });
        }
        catch(e){
            console.error(e)
        }

        finally{
            console.log("Server connection end");
        }
    }

    

}
function resultShow(){
    var result = document.getElementById('result');
    if (!result) return;
    result.classList.toggle('is-show');

    var blackBg = document.getElementById('js-black-bg');
    var closeBtn = document.getElementById('js-close-btn');

    resultClose(blackBg);
    resultClose(closeBtn);

    function resultClose(elem){
        if(!elem) return;
        elem.addEventListener('click', function(){
            result.classList.toggle('is-show');
        });
    }
}