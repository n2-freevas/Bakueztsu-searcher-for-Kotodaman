function PayjpElementSet(payjpdata){
    var fundBtn = document.getElementById('fund-button');
    var fund_button = document.getElementById('fund-button');
    const elements = payjpdata.elements();
    elements.create('card', {style: {base: {color: '#fff'}}})
    const cardElement = elements.getElement('card');
    cardElement.mount('#fundpage');

    fund_button.addEventListener('click',function(){
        console.log('clock')
        payjpdata.createToken(cardElement).then((response) => {
            if (response.error){
                alert('ごめんなさい！決済システムの不具合のようです．お気持ちだけ受け取っておきます．')
            }
            else{
                console.log(response)
            }
        })
    });
}
