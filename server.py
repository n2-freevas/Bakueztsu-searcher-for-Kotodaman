from flask import Flask,render_template,request
import WordCandidate
import payjp
import os

SECRET_KEY = 'sk_live_f990aa639d4262c53d0008e6681a9d98c962ea28f1f981809765b1a8'
PUBLIC_KEY = 'pk_live_c95fda4f314de6bbefbd6b6c'
payjp.api_key = SECRET_KEY

app = Flask(__name__,static_folder='static')

@app.route('/')
def hello():
    return render_template('index.html',public_key=PUBLIC_KEY)

@app.route('/register', methods=['POST'])
def post():
    banmen_string = request.form['banmen']
    candidate = request.form['priority']
    if len(candidate) == 0:
        candidate = None
    return_word = WordCandidate.candidator(target=banmen_string,candidate_char=candidate)
    

    return render_template('result.html',posts = return_word)


@app.route('/pay',methods=['POST'])
def pay():

    amount = 1000
    customer = payjp.Customer.create(
       card=request.form['payjp-token']
    )
    payjp.Charge.create(
        amount=amount,
        currency='jpy',
        customer=customer.id,
        description='Funding from Bakuzetsu site user'
    )
    return render_template('pay.html', amount=amount)


if __name__ == "__main__":
    app.run(debug=True)
